import { knex } from 'knex';
import getConfig from '../../tools/configLoader';
import type { ILoginKeys } from '../../types';

export default class Mysql {
  private _knex: knex.Knex | undefined;

  private get knex(): knex.Knex {
    return this._knex as knex.Knex;
  }

  private set knex(value: knex.Knex) {
    this._knex = value;
  }

  init(): void {
    this.knex = knex({
      client: 'mysql2',
      connection: {
        host: getConfig().mysql.host,
        user: getConfig().mysql.user,
        password: getConfig().mysql.password,
        database: getConfig().mysql.db,
      },
      pool: {
        min: 10,
        max: 20,
      },
    });
  }

  async getKeys(): Promise<ILoginKeys[]> {
    return this.knex('keys').select();
  }

  async addKeys(keys: unknown[]): Promise<void> {
    const now = new Date();

    await this.knex('keys').insert(
      keys.map((k) => {
        return {
          key: JSON.stringify(k),
          expiration: now,
        };
      }),
    );
  }
}