import Provider from 'oidc-provider';
import oidcClaims from './claims';
import State from '../state';
import Log from '../tools/logger/log';
import type { Configuration } from 'oidc-provider';

export default class Oidc {
  async init(): Promise<Provider> {
    const claims = await this.initClaims();
    return this.initProvider(claims);
  }

  private async initClaims(): Promise<Configuration> {
    State.keys = (await State.mysql.getKeys()).map((e) => e.key);
    const clients = await State.mysql.getOidcClients();
    return oidcClaims(State.keys, clients);
  }

  private initProvider(claims: Configuration): Provider {
    const events = [
      'access_token.saved',
      'authorization_code.saved',
      'client_credentials.saved',
      'refresh_token.saved',
    ];
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
    ];
    const provider = new Provider('http://localhost', claims);
    provider.proxy = true;

    for (const e of events) {
      provider.on(e, () => {
        Log.log('Token event', JSON.stringify(e));
      });
    }

    for (const e of errors) {
      provider.on(e, (...err: Record<string, unknown>[]) => {
        Log.log(e, JSON.stringify(err[0]));
      });
    }

    provider.on('server_error', (...err) => {
      console.trace(err);
    });

    return provider;
  }
}
