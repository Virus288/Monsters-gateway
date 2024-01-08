import { ILoginKeys } from '../../../src/types';
import Mysql from '../../../src/connections/mysql';
import { ClientMetadata } from 'oidc-provider';

export default class FakeMysql extends Mysql {
  override async addKeys(_keys: unknown[]): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  override async getKeys(): Promise<ILoginKeys[]> {
    return new Promise((resolve) => resolve([]));
  }

  override async getOidcClients(): Promise<ClientMetadata[]> {
    return new Promise((resolve) => resolve([]));
  }
}
