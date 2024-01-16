import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('oidcClients', (table) => {
    table.increments('id').primary();
    table.string('client_id');
    table.string('client_secret');
    table.json('grant_types');
    table.json('redirect_uris');
    table.string('scope');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTableIfExists('oidcClients');
};
