import login from './modules/users/login/router';
import register from './modules/users/register/router';
import profileRouter from './modules/profiles/router';
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
    this.router.use(profiles, profileRouter.router);
  }

  generateDocumentation(): void {
    const options: swaggerJsdoc.Options = {
      definition: {
        openapi: '3.0.1',
        description: 'This is a REST API for monsters game',
        servers: [
          {
            url: 'http://localhost:5003',
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
        './src/structure/modules/*/router.ts',
        './src/structure/modules/*/entity.d.ts',
        './src/structure/modules/*/dto.d.ts',
        './src/structure/modules/*/*/router.ts',
        './src/structure/modules/*/*/entity.d.ts',
        './src/structure/modules/*/*/dto.d.ts',
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
