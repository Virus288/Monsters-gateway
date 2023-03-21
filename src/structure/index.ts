import Middleware from './middleware';
import http from 'http';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import type * as types from '../types';
import * as errors from '../errors';
import AppRouter from './router';
import express from 'express';
import userValidation from '../tools/token';

export default class Router {
  readonly app: express.Express;
  private readonly _middleware: Middleware;

  constructor() {
    this.app = express();
    this._middleware = new Middleware();
  }

  private get middleware(): Middleware {
    return this._middleware;
  }

  private _server: http.Server;

  private get server(): http.Server {
    return this._server;
  }

  init(): void {
    this.initMiddleware();
    this.initRouter();
    this.initServer();
    this.initErrHandler();
  }

  /**
   * Close server
   */
  close(): void {
    Log.log('Server', 'Closing');
    if (!this.server) return;

    this.server.closeAllConnections();
    this.server.close();
  }

  /**
   * Init middleware
   */
  private initMiddleware(): void {
    this.middleware.generateMiddleware(this.app);
  }

  /**
   * Init err handler, catching errors in whole app
   */
  private initErrHandler(): void {
    this.middleware.generateErrHandler(this.app);
  }

  /**
   * Init basic routes. Add "debug" route while in development mode
   */
  private initRouter(): void {
    const router = new AppRouter(this.app);
    router.initRoutes();
    userValidation(this.app);
    router.initSecured();

    this.app.all('*', (_req, res: types.ILocalUser) => {
      const { message, code, name, status } = new errors.NotFoundError();
      res.status(status).json({ message, code, name });
    });
  }

  /**
   * Init server
   */
  private initServer(): void {
    this._server = http.createServer(this.app);

    this.server.listen(getConfig().httpPort, () => {
      Log.log('Server', `Listening on ${getConfig().httpPort}`);
    });
  }
}
