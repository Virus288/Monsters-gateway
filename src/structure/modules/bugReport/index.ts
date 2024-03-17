import add from './add/router';
import type { Router } from 'express';

const initBugReportRoutes = (router: Router): void => {
  const prefix = '/bug';

  router.use(prefix, add.router);
};

export default initBugReportRoutes;
