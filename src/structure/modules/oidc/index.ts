import debug from './debug/router';
import interaction from './interaction/router';
import type { Router } from 'express';
import type Provider from 'oidc-provider';

const routes = {
  init: (provider: Provider): void => {
    interaction.init(provider);
  },
  interaction: interaction.router,
};

export const initOidcRoutes = (router: Router): void => {
  const prefix = '/interaction';

  if (process.env.NODE_ENV !== 'production') {
    router.use(`/debug${prefix}`, debug.router);
  }

  router.use(prefix, interaction.router);
};

export default routes;
