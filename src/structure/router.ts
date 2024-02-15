import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Middleware from './middleware';
import initInventoryRoutes from './modules/inventory';
import initLogsRoutes from './modules/logs';
import initMessagesRoutes from './modules/message';
import oidc, { initOidcRoutes } from './modules/oidc';
import initPartyRoutes from './modules/party';
import initProfileRoutes from './modules/profile';
import { initRemoveAccountRoutes, initSecuredUserRoutes, initUserRoutes } from './modules/user';
import { version } from '../../package.json';
import * as errors from '../errors';
import { IncorrectTokenError } from '../errors';
import handleErr from '../errors/utils';
import State from '../state';
import Log from '../tools/logger/log';
import { validateToken } from '../tools/token';
import type * as types from '../types';
import type { Router } from 'express';
import type Provider from 'oidc-provider';
import type { AdapterPayload } from 'oidc-provider';
import type swaggerJsdoc from 'swagger-jsdoc';

export default class AppRouter {
  private readonly _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  private get router(): Router {
    return this._router;
  }

  initRoutes(provider: Provider): void {
    oidc.init(provider);
    initUserRoutes(this.router);
    initOidcRoutes(this.router);

    if (process.env.NODE_END === 'testDev') {
      this.initDebugRoutes();
    }
  }

  initSecuredRoutes(provider: Provider): void {
    this.router.use(Middleware.userValidation);

    initRemoveAccountRoutes(this.router, provider);

    this.router.use(Middleware.initUserProfile);

    initProfileRoutes(this.router);

    this.router.use(Middleware.userProfileValidation);

    initSecuredUserRoutes(this.router);
    initPartyRoutes(this.router);
    initMessagesRoutes(this.router);
    initInventoryRoutes(this.router);
    initLogsRoutes(this.router);
  }

  generateDocumentation(): void {
    const options: swaggerJsdoc.Options = {
      definition: {
        openapi: '3.0.1',
        description: 'This is a REST API for monsters game',
        servers: [
          {
            url: 'http://localhost',
            description: 'Development server',
          },
        ],
        info: {
          title: 'Monsters API doc',
          version,
        },
        component: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            refreshToken: {
              type: 'http',
              scheme: 'x-refresh-token',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: [
        './src/errors/index.ts',
        './src/structure/modules/*/*/router.ts',
        './src/structure/modules/*/entity.d.ts',
        './src/structure/modules/*/types.d.ts',
        './src/structure/modules/*/*/entity.d.ts',
        './src/structure/modules/*/*/types.d.ts',
        './src/tools/websocket/docs/index.ts',
        './src/tools/websocket/dto.d.ts',
        './src/tools/websocket/entities.d.ts',
      ],
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.router.get('docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initDebugRoutes(): void {
    // Disable oidc token validation for 'testDev' environment
    this.router.get('/me', async (req, res): Promise<void> => {
      const token =
        ((req.cookies as Record<string, string>)['monsters.uid'] as string) ??
        (req.headers.authorization !== undefined ? req.headers.authorization.split('Bearer')[1]!.trim() : undefined);

      try {
        const payload = await validateToken(token);
        const cachedToken = await State.redis.getOidcHash(`oidc:AccessToken:${payload.jti}`, payload.jti);
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

        res.locals.userId = payload.sub;
        const locals = res.locals as types.IUsersTokens;

        res.send({
          login: locals.user?.login,
          sub: payload.sub,
        });
      } catch (err) {
        handleErr(new errors.UnauthorizedError(), res);
      }
    });
  }
}
