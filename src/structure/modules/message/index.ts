import get from './get/router';
import getUnread from './getUnread/router';
import read from './read/router';
import send from './send/router';

import type { Router } from 'express';

const initProfileRoutes = (router: Router): void => {
  const prefix = '/message';

  router.use(prefix, get.router).use(prefix, send.router).use(prefix, getUnread.router).use(prefix, read.router);
};

export default initProfileRoutes;
