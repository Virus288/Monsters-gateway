import drop from './drop/router';
import get from './get/router';
import use from './use/router';
import type { Router } from 'express';

const initInventoryRoutes = (router: Router): void => {
  const prefix = '/inventory';

  router.use(prefix, drop.router).use(prefix, use.router).use(prefix, get.router);
};

export default initInventoryRoutes;
