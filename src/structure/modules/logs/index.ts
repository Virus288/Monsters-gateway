import add from './add/router';
import get from './get/router';
import type { Router } from 'express';

const initLogsRoutes = (router: Router): void => {
  const prefix = '/logs';

  router.use(prefix, get.router).use(prefix, add.router);
};
export default initLogsRoutes;
