import attack from './attack/router';
import debug from './debug/router';
import getFight from './getFights/router';
import getFightLogs from './getLogs/router';
import leave from './leave/router';
import type { Router } from 'express';

const initFightsRoutes = (router: Router): void => {
  const prefix = '/fights';

  router
    .use(prefix, leave.router)
    .use(prefix, attack.router)
    .use(prefix, getFight.router)
    .use(prefix, getFightLogs.router);

  // Debug routes
  if (process.env.NODE_ENV !== 'production') {
    router.use(`/debug${prefix}`, debug.router);
  }
};

export default initFightsRoutes;
