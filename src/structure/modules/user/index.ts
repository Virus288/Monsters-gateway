import debug from './debug/router';
import getDetails from './details/router';
import register from './register/router';
import remove from './remove/router';
import type { Router } from 'express';
import type Provider from 'oidc-provider';

export const initSecuredUserRoutes = (router: Router): void => {
  const prefix = '/users';

  router.use(prefix, getDetails.router);
};

export const initUserRoutes = (router: Router): void => {
  const prefix = '/users';

  router.use(prefix, register.router);
  // Debug routes
  if (process.env.NODE_ENV !== 'production') {
    router.use(prefix, debug.router);
  }
};

export const initRemoveAccountRoutes = (router: Router, provider: Provider): void => {
  const prefix = '/users';

  remove.init(provider);

  router.use(prefix, remove.router);
};
