import { knex } from 'knex';
import getConfig from '../../tools/configLoader';
import type { ILoginKeys } from '../../types';
import type { ClientMetadata } from 'oidc-provider';

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

  close(): void {
    this.knex.destroy().catch(() => {
      // Ignored
    });
  }

  async getKeys(): Promise<ILoginKeys[]> {
    return this.knex('keys').select();
  }

  async getOidcClients(): Promise<ClientMetadata[]> {
    return this.knex('oidcClients').select();
  }

  async addKeys(keys: ILoginKeys[]): Promise<void> {
    await this.knex('keys').insert(keys);
  }

  async addOidcClient(client: ClientMetadata): Promise<void> {
    await this.knex('oidcClients').insert({
      ...client,
      grant_types: JSON.stringify(client.grant_types),
      redirect_uris: JSON.stringify(client.redirect_uris),
    });
  }
}
