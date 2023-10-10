import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import item from './modules/inventory';
import party from './modules/party';
import profile from './modules/profile';
import user from './modules/user';
import { version } from '../../package.json';
import type { Router } from 'express';
import type swaggerJsdoc from 'swagger-jsdoc';

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
    this.router.use(users, user.login).use(users, user.register);
  }

  initSecured(): void {
    const users = '/users';
    const parties = '/party';
    const profiles = '/profile';
    const inventories = '/inventory';

    this.router.use(profiles, profile.add).use(profiles, profile.get);
    this.router.use(users, user.refreshToken).use(users, user.getDetails).use(users, user.remove);
    this.router.use(inventories, item.drop).use(inventories, item.use).use(inventories, item.get);
    this.router.use(parties, party.get);
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
