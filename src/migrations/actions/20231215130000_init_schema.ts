import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('keys', (table) => {
    table.increments('id').primary();
    table.json('key').notNullable();
    table.timestamp('expiration');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTableIfExists('keys');
};
