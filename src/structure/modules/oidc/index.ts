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

  router.use(prefix, interaction.router);
};

export default routes;
