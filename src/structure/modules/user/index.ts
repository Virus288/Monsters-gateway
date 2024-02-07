import debug from './debug/router';
import getDetails from './details/router';
import register from './register/router';
import remove from './remove/router';
import type { Router } from 'express';

export const initSecuredUserRoutes = (router: Router): void => {
  const prefix = '/users';

  router.use(prefix, remove.router).use(prefix, getDetails.router);
};

export const initUserRoutes = (router: Router): void => {
  const prefix = '/users';

  router.use(prefix, register.router);
  // Debug routes
  if (process.env.NODE_END !== 'prod') {
    router.use(prefix, debug.router);
  }
};
