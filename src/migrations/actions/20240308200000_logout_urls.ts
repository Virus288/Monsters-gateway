import { generateRandomName } from '../../utils';
import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex('oidcClients').insert({
    client_id: 'oidcClient',
    client_secret: generateRandomName(),
    grant_types: JSON.stringify(['authorization_code', 'refresh_token']),
    scope: 'openid',
    redirect_uris: JSON.stringify(['http://127.0.0.1/login']),
    post_logout_redirect_uris: JSON.stringify(['http://127.0.0.1']),
  });
};

export const down = async (): Promise<void> => {
  return new Promise((resolve) => {
    resolve();
  });
};
