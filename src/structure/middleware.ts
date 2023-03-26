import type { Express } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as errors from '../errors';
import { InternalError } from '../errors';
import getConfig from '../tools/configLoader';
import errLogger from '../tools/logger/logger';
import Log from '../tools/logger/log';
import type * as types from '../types';
import handleErr from '../errors/utils';
import { verify } from '../tools/token';
import Validation from './validation';

export default class Middleware {
  private readonly _validation: Validation;

  constructor() {
    this._validation = new Validation();
  }

  private get validation(): Validation {
    return this._validation;
  }

  generateMiddleware(app: Express): void {
    app.use(express.json({ limit: '500kb' }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: getConfig().corsOrigin,
        credentials: true,
      }),
    );

    app.use((req: express.Request, res: types.ILocalUser, next: express.NextFunction) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

      this.validation.validate(req);
      next();
    });
  }

  generateErrHandler(app: Express): void {
    app.use(
      (
        err: express.Errback | types.IFullError,
        req: express.Request,
        res: types.ILocalUser,
        _next: express.NextFunction,
      ) => {
        errLogger.error('Caught new generic error').error(`Caused by ${req.ip}`).error(JSON.stringify(err));

        if (err.name === 'SyntaxError') {
          Log.error('Middleware', 'Generic err', err.name);
          const { message, code, name, status } = new InternalError();
          return res.status(status).json({ message, code, name });
        } else {
          const error = err as types.IFullError;
          if (error.code !== undefined) {
            const { message, code, name, status } = error;
            return res.status(status).json({ message, code, name });
          } else {
            Log.error('Middleware', 'Generic err', err.name);
            const { message, code, name, status } = new InternalError();
            return res.status(status).json({ message, code, name });
          }
        }
      },
    );
  }

  userValidation(app: express.Express): void {
    app.use((req: express.Request, res: types.ILocalUser, next: express.NextFunction) => {
      let access: string;
      if (req.headers.authorization) {
        const key = req.headers.authorization;
        if (key.includes('Bearer')) {
          access = req.headers.authorization.split('Bearer')[1].trim();
        }
      }

      try {
        if (!access) throw new errors.UnauthorizedError();
        verify(res, access);
        next();
      } catch (err) {
        return handleErr(new errors.UnauthorizedError(), res);
      }
    });
  }
}
