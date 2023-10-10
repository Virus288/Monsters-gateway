import express from 'express';
import Middleware from './middleware';
import AppRouter from './router';
import * as errors from '../errors';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import http from 'http';

export default class Router {
  private readonly _middleware: Middleware;
  private readonly _app: express.Express;
  private readonly _router: AppRouter;
  private _server: http.Server | undefined = undefined;

  constructor() {
    this._app = express();
    this._middleware = new Middleware();
    this._router = new AppRouter(this.app);
  }

  get app(): express.Express {
    return this._app;
  }

  get router(): AppRouter {
    return this._router;
  }

  private get middleware(): Middleware {
    return this._middleware;
  }

  private get server(): http.Server {
    return this._server!;
  }

  init(): void {
    this.initDocumentation();
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
    this.middleware.initializeHandler(this.app);
  }

  /**
   * Init err handler, catching errors in whole app
   */
  private initErrHandler(): void {
    this.middleware.generateErrHandler(this.app);
  }

  /**
   * Init swagger documentation
   */
  private initDocumentation(): void {
    this.router.generateDocumentation();
  }

  /**
   * Init basic routes. Add "debug" route while in development mode
   */
  private initRouter(): void {
    this.router.initRoutes();
    this.middleware.userValidation(this.app);
    this.router.initSecured();

    this.app.all('*', (_req, res: express.Response) => {
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
