import { ILoginKeys } from '../../../src/types';
import Mysql from '../../../src/connections/mysql';
import { ClientMetadata } from 'oidc-provider';
import { getKeys as generateKeys } from '../../../src/oidc/utils';

export default class FakeMysql extends Mysql {
  override async addKeys(_keys: unknown[]): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  override async getKeys(): Promise<ILoginKeys[]> {
    const keys = await generateKeys(10);
    const now = new Date();
    let keyNumber: number = 0;

    return keys.map((k) => {
      return {
        id: keyNumber++,
        key: k,
        expiration: now,
      };
    }) as ILoginKeys[];
  }

  override async getOidcClients(): Promise<ClientMetadata[]> {
    return new Promise((resolve) =>
      resolve([
        {
          id: 2,
          client_id: 'oidcClient',
          client_secret: 'secret',
          grant_types: ['authorization_code', 'refresh_token'],
          redirect_uris: ['http://localhost:3005/login'],
          scope: 'openid',
        },
      ]),
    );
  }
}
