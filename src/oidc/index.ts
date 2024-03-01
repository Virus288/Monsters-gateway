import Provider from 'oidc-provider';
import oidcClaims from './claims';
import { getKeys as generateKeys } from './utils';
import State from '../state';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger';
import type { ILoginKeys } from '../types';
import type { Configuration } from 'oidc-provider';

export default class Oidc {
  async init(): Promise<Provider> {
    const claims = await this.initClaims();
    return this.initProvider(claims);
  }

  private initProvider(claims: Configuration): Provider {
    const errors = [
      'authorization.error',
      'grant.error',
      'certificates.error',
      'discovery.error',
      'introspection.error',
      'revocation.error',
      'userinfo.error',
      'check_session.error',
      'backchannel.error',
      'server_error',
    ];
    const provider = new Provider(getConfig().myAddress.replace(/:\d+/u, ''), claims);
    provider.proxy = true;

    for (const e of errors) {
      provider.on(e, (...err: Record<string, unknown>[]) => {
        Log.error(e, err[0]);
      });
    }
    return provider;
  }

  private async initClaims(): Promise<Configuration> {
    let keys = await State.mysql.getKeys();

    if (!keys || keys.length === 0) {
      const newKeys = await generateKeys(10);
      const now = new Date();
      let keyNumber: number = 0;
      keys = newKeys.map((k) => {
        return {
          id: keyNumber++,
          key: k,
          expiration: now,
        };
      }) as ILoginKeys[];
      await State.mysql.addKeys(keys);
    }
    State.keys = keys.map((e) => e.key);
    const clients = await State.mysql.getOidcClients();
    return oidcClaims(State.keys, clients);
  }
}
