import add from './add/router';
import get from './get/router';
import type { RequestHandler, Router } from 'express';

const initProfileRoutes = (router: Router, userValidation: RequestHandler): void => {
  const prefix = '/profile';

  router.use(prefix, userValidation, get.router).use(prefix, userValidation, add.router);
};
export default initProfileRoutes;
