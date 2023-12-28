import get from './get/router';
import type { RequestHandler, Router } from 'express';

const initPartyRoutes = (router: Router, userValidation: RequestHandler): void => {
  const prefix = '/party';

  router.use(prefix, userValidation, get.router);
};
export default initPartyRoutes;
