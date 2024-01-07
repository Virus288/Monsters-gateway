import add from './add/router';
import get from './get/router';
import type { Router } from 'express';

const initProfileRoutes = (router: Router): void => {
  const prefix = '/profile';

  router.use(prefix, get.router).use(prefix, add.router);
};
export default initProfileRoutes;
