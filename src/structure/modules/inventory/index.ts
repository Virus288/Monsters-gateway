import drop from './drop/router';
import get from './get/router';
import use from './use/router';
import type { RequestHandler, Router } from 'express';

const initInventoryRoutes = (router: Router, userValidation: RequestHandler): void => {
  const prefix = '/inventory';

  router
    .use(prefix, userValidation, drop.router)
    .use(prefix, userValidation, use.router)
    .use(prefix, userValidation, get.router);
};

export default initInventoryRoutes;
