import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema
    .raw('ALTER DATABASE `monsters` DEFAULT CHARSET=utf8 COLLATE utf8_general_ci')
    .createTable('keys', (table) => {
      table.integer('key');
      table.integer('expiration').defaultTo(0);
    });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTableIfExists('monsters');
};
