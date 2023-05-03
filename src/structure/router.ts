import login from './modules/users/login/router';
import register from './modules/users/register/router';
import refresh from './modules/users/refreshToken/router';
import getProfileRouter from './modules/profiles/get/router';
import addProfileRouter from './modules/profiles/add/router';
import detailsRouter from './modules/users/details/router';
import type { Router } from 'express';
import type swaggerJsdoc from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';
import swaggerUi from 'swagger-ui-express';

export default class AppRouter {
  private readonly _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  private get router(): Router {
    return this._router;
  }

  initRoutes(): void {
    const users = '/users';
    this.router.use(users, login.router).use(users, register.router);
  }

  initSecured(): void {
    const profiles = '/profile';
    const users = '/users';

    this.router.use(profiles, addProfileRouter.router).use(profiles, getProfileRouter.router);
    this.router.use(users, refresh.router).use(users, detailsRouter.router);
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
}
