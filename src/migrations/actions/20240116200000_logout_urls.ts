import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.alterTable('oidcClients', (table) => {
    table.json('post_logout_redirect_uris');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.alterTable('oidcClients', (table) => {
    table.dropColumn('post_logout_redirect_uris');
  });
};
