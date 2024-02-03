import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import ReqHandler from './reqHandler';
import * as errors from '../errors';
import { IncorrectDataType, InternalError } from '../errors';
import handleErr from '../errors/utils';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import errLogger from '../tools/logger/logger';
import { validateToken } from '../tools/token';
import type * as types from '../types';
import type { Express } from 'express';
import type Provider from 'oidc-provider';
import * as path from 'path';
import * as process from 'process';

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
      res.locals.userId = payload.sub;

      // #TODO Validate if profile is initialized. Without initializing profile, user should not be able to send most of requests

      return next();
    } catch (err) {
      return handleErr(new errors.UnauthorizedError(), res);
    }
  }

  private static shouldSkipUserValidation(req: express.Request): boolean {
    // #TODO Disable token validation in tests for now. Find a way to generate keys for tests
    if (process.env.NODE_ENV === 'test') return true;

    // Disable token validation for oidc routes
    const oidcRoutes = ['.well-known', 'me', 'auth', 'token', 'session', 'certs'];
    const splitRoute = req.path.split('/');
    return splitRoute.length > 1 && oidcRoutes.includes(splitRoute[1] as string);
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
    app.set('view engine', 'ejs');
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
