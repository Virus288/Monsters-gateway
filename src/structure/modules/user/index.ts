import getDetails from './details/router';
import register from './register/router';
import remove from './remove/router';
import type { RequestHandler, Router } from 'express';

export const initSecuredUserRoutes = (router: Router, userValidation: RequestHandler): void => {
  const prefix = '/users';

  router.use(prefix, userValidation, remove.router).use(prefix, userValidation, getDetails.router);
};

export const initUserRoutes = (router: Router): void => {
  const prefix = '/users';

  router.use(prefix, register.router);
};
