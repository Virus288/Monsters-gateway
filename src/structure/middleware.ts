import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import ReqHandler from './reqHandler';
import { EJwt } from '../enums';
import * as errors from '../errors';
import { InternalError } from '../errors';
import handleErr from '../errors/utils';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import errLogger from '../tools/logger/logger';
import State from '../tools/state';
import { verify } from '../tools/token';
import type * as types from '../types';
import type { Express } from 'express';
import type Provider from 'oidc-provider';
import * as path from 'path';

export default class Middleware {
  generateMiddleware(app: Express): void {
    app.use(express.json({ limit: '500kb' }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: getConfig().corsOrigin,
        credentials: true,
      }),
    );
    app.use(helmet());

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

        if (err.name === 'SyntaxError') {
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

  async userValidation(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    let access: string | undefined = undefined;

    if (req.headers.authorization) {
      const key = req.headers.authorization;
      if (key.includes('Bearer')) {
        access = req.headers.authorization.split('Bearer')[1]!.trim();
      }
    } else {
      access = (req.cookies as { [EJwt.AccessToken]: string | undefined })[EJwt.AccessToken];
    }

    try {
      if (!access) throw new errors.UnauthorizedError();
      const { id } = verify(res, access);

      const user = await State.redis.getRemovedUsers(id);
      if (user) throw new errors.UnauthorizedError();

      return next();
    } catch (err) {
      return handleErr(new errors.UnauthorizedError(), res);
    }
  }

  initializeHandler(app: express.Express): void {
    app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.reqHandler = new ReqHandler();
      next();
    });
  }
}
