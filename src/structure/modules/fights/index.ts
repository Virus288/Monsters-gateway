import debug from './debug/router';
import leave from './leave/router';
import type { Router } from 'express';

const initFightsRoutes = (router: Router): void => {
  const prefix = '/fights';

  router.use(`${prefix}`, leave.router);

  // Debug routes
  if (process.env.NODE_ENV !== 'production') {
    router.use(`/debug${prefix}`, debug.router);
  }
};

export default initFightsRoutes;
