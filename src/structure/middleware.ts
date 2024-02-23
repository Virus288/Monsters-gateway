import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import GetProfileDto from './modules/profile/get/dto';
import UserDetailsDto from './modules/user/details/dto';
import ReqHandler from './reqHandler';
import * as errors from '../errors';
import { IncorrectDataType, IncorrectTokenError, InternalError, ProfileNotInitialized } from '../errors';
import handleErr from '../errors/utils';
import State from '../state';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import errLogger from '../tools/logger/logger';
import { validateToken } from '../tools/token';
import type { IProfileEntity } from './modules/profile/entity';
import type { IUserEntity } from './modules/user/entity';
import type * as types from '../types';
import type { Express } from 'express';
import type Provider from 'oidc-provider';
import type { AdapterPayload } from 'oidc-provider';
import * as path from 'path';

export default class Middleware {
  static async userValidation(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    if (Middleware.shouldSkipUserValidation(req)) {
      return next();
    }
    // Validate token
    const token =
      ((req.cookies as Record<string, string>)['monsters.uid'] as string) ??
      (req.headers.authorization !== undefined ? req.headers.authorization.split('Bearer')[1]!.trim() : undefined);

    try {
      const payload = await validateToken(token);
      const cachedToken = await State.redis.getOidcHash(`oidc:AccessToken:${payload.jti}`, payload.jti);
      res.locals.userId = payload.sub;

      if (process.env.NODE_ENV === 'test') return next();

      if (!cachedToken) {
        Log.error(
          'User tried to log in using token, which does not exists in redis. Might just expired between validation and redis',
        );
        throw new IncorrectTokenError();
      }
      const t = JSON.parse(cachedToken) as AdapterPayload;
      if (Date.now() - new Date((t.exp as number) * 1000).getTime() > 0) {
        Log.error('User tried to log in using expired token, which for some reason is in redis', {
          token: payload.jti,
        });
        throw new IncorrectTokenError();
      }

      return next();
    } catch (err) {
      Log.error('Token validation error', err);
      return handleErr(new errors.UnauthorizedError(), res);
    }
  }

  static async initUserProfile(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    if (Middleware.shouldSkipUserValidation(req)) {
      return next();
    }

    try {
      const userId = res.locals.userId as string;
      // Validate if profile is initialized
      let user = await State.redis.getCachedUser(userId);

      if (!user) {
        user = await Middleware.fetchUserProfile(res, userId);
      }

      res.locals.profile = user.profile;
      res.locals.user = user.account;

      return next();
    } catch (err) {
      return handleErr(err as types.IFullError, res);
    }
  }

  static async userProfileValidation(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    if (Middleware.shouldSkipUserValidation(req)) {
      return next();
    }

    try {
      let { profile } = res.locals as types.IUsersTokens;
      if (!profile) {
        const user = await Middleware.fetchUserProfile(res, (res.locals as types.IUsersTokens).userId as string);
        // eslint-disable-next-line prefer-destructuring
        profile = user.profile;
      }

      if (!profile?.initialized) {
        throw new ProfileNotInitialized();
      }

      return next();
    } catch (err) {
      return handleErr(new errors.ProfileNotInitialized(), res);
    }
  }

  private static shouldSkipUserValidation(req: express.Request): boolean {
    // Disable token validation for oidc routes
    const oidcRoutes = ['.well-known', 'me', 'auth', 'token', 'session', 'certs'];
    const splitRoute = req.path.split('/');
    return splitRoute.length > 1 && oidcRoutes.includes(splitRoute[1] as string);
  }

  private static async fetchUserProfile(res: express.Response, userId: string): Promise<types.ICachedUser> {
    const reqHandler = new ReqHandler();
    const user: types.ICachedUser = { account: undefined, profile: undefined };

    user.account = (
      await reqHandler.user.getDetails([new UserDetailsDto({ id: userId })], {
        userId,
        tempId: (res.locals.tempId ?? '') as string,
      })
    ).payload[0];
    user.profile = (
      await reqHandler.profile.get(new GetProfileDto(userId), {
        userId,
        tempId: (res.locals.tempId ?? '') as string,
      })
    ).payload;

    if (!user.profile || !user.account) {
      Log.error(
        'Token validation',
        'User tried to log in using token, that got validated, but there is no user related to token. Is token fake ?',
      );
      throw new IncorrectTokenError();
    }
    await State.redis.addCachedUser(user as { account: IUserEntity; profile: IProfileEntity });
    return user;
  }

  generateMiddleware(app: Express): void {
    app.use(express.json({ limit: '500kb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: getConfig().corsOrigin,
        credentials: true,
      }),
    );
    // #TODO I am struggling with setting helmet properly. Chrome says "Refused to send form data because it violates the following Content Security Policy directive: "form-action 'self'"." and I already spend too long on this...
    // app.use(
    //   helmet({
    //     contentSecurityPolicy: {
    //       useDefaults: true,
    //       directives: {
    //         defaultSrc: ["'self'", `${getConfig().corsOrigin as string}`, `${getConfig().myAddress}`],
    //         'form-action': ["'self'", `${getConfig().corsOrigin as string}`, `${getConfig().myAddress}`],
    //       },
    //     },
    //   }),
    // );

    app.use((_req: express.Request, res, next: express.NextFunction) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    app.use(
      session({
        secret: getConfig().session.secret,
        resave: false,
        rolling: false,
        saveUninitialized: false,
        cookie: {
          secure: getConfig().session.secured,
          maxAge: 60 * 60 * 1000,
        },
        name: 'monsters.sid',
      }),
    );
    app.set('views', path.join(__dirname, '..', '..', '..', 'public'));
    app.use('/public', express.static(path.join(__dirname, '..', '..', '..', 'public', 'static')));
    app.set('view engine', 'ejs');

    app.use((req, _res, next) => {
      try {
        const logBody: Record<string, string | Record<string, string>> = {
          method: req.method,
          path: req.path,
          ip: req.ip as string,
        };
        if (req.query) logBody.query = JSON.stringify(req.query);
        if (req.body) {
          if (req.path.includes('interaction') || req.path.includes('register')) {
            logBody.body = { ...(req.body as Record<string, string>) };
            logBody.body.password = '***';
          } else {
            logBody.body = req.body as Record<string, string>;
          }
        }

        Log.log('New req', logBody);
        next();
      } catch (err) {
        Log.error('Middleware validation', err);
      }
    });
  }

  generateOidc(app: Express, provider: Provider): void {
    app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      req.provider = provider;
      next();
    });
  }

  generateOidcMiddleware(app: Express, provider: Provider): void {
    app.use(provider.callback);
  }

  generateErrHandler(app: Express): void {
    app.use(
      (
        err: express.Errback | types.IFullError,
        req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        errLogger
          .error('Caught new generic error')
          .error(`Caused by ${req.ip ?? 'unknown ip'}`)
          .error(JSON.stringify(err));
        const error = err as types.IFullError;

        if (error.message.includes('is not valid JSON')) {
          Log.error('Middleware', 'Received req is not of json type', error.message, error.stack);
          const { message, name, status } = new IncorrectDataType();
          return res.status(status).json({ message, name });
        }
        if (error.name === 'SyntaxError') {
          Log.error('Middleware', 'Generic err', error.message, error.stack);
          const { message, code, name, status } = new InternalError();
          return res.status(status).json({ message, code, name });
        }
        if (error.code !== undefined) {
          const { message, code, name, status } = error;
          return res.status(status).json({ message, code, name });
        }
        Log.error('Middleware', 'Generic err', error.message, error.stack);
        const { message, code, name, status } = new InternalError();
        return res.status(status).json({ message, code, name });
      },
    );
  }

  initializeHandler(app: express.Express): void {
    app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.reqHandler = new ReqHandler();
      next();
    });
  }
}
