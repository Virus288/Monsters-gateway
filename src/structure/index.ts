import express from 'express';
import Middleware from './middleware';
import AppRouter from './router';
import Oidc from '../oidc';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger/log';
import type Provider from 'oidc-provider';
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

  async init(): Promise<void> {
    const provider = await new Oidc().init();
    this.initDocumentation();
    this.initMiddleware(provider);
    this.initRouter(provider);
    this.initServer();
    this.initSecuredRouter();
    this.initErrHandler();
    this.initOidc(provider);
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
  private initMiddleware(provider: Provider): void {
    this.middleware.generateOidc(this.app, provider);
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
  private initRouter(provider: Provider): void {
    this.router.initRoutes(provider);
  }

  /**
   * Init secured routes.
   */
  private initSecuredRouter(): void {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.router.initSecuredRoutes(this.middleware.userValidation);
  }

  /**
   * Init basic routes. Add "debug" route while in development mode
   */
  private initOidc(provider: Provider): void {
    this.middleware.generateOidcMiddleware(this.app, provider);
  }

  /**
   * Init server
   */
  private initServer(): void {
    if (process.env.NODE_ENV === 'test') return;
    this._server = http.createServer(this.app);

    this.server.listen(getConfig().httpPort, () => {
      Log.log('Server', `Listening on ${getConfig().httpPort}`);
    });
  }
}
