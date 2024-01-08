import Adapter from './adapter';
import findAccount from './user';
import type { JSONWebKey } from 'jose';
import type { ClientMetadata, Configuration } from 'oidc-provider';

const claims = (keys: JSONWebKey[], clients: ClientMetadata[]): Configuration => {
  return {
    adapter: Adapter,

    claims: {
      openid: ['login'],
    },

    clients,

    cookies: {
      long: {
        maxAge: 60 * 1000,
      },
      keys: ['key'],
    },

    findAccount,

    features: {
      devInteractions: {
        enabled: false,
      },

      userinfo: { enabled: true },

      clientCredentials: {
        enabled: true,
      },
      introspection: {
        enabled: true,
        allowedPolicy: (ctx, client, token): boolean => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return !(client.introspectionEndpointAuthMethod === 'none' && token.clientId !== ctx.oidc.client.clientId);
        },
      },
      revocation: {
        enabled: true,
      },
    },
    formats: {
      AccessToken: 'jwt',
      ClientCredentials: 'jwt',
    },

    issueRefreshToken: (_ctx, client /* , code*/): boolean => {
      return client.grantTypeAllowed('refresh_token');
    },
    expiresWithSession: (): boolean => {
      return false;
    },

    jwks: {
      keys,
    },

    routes: {
      jwks: '/certs',
    },

    tokenEndpointAuthMethods: ['client_secret_basic', 'client_secret_jwt', 'client_secret_post'],

    ttl: {
      AccessToken: 7 * 24 * 60 * 60,
      AuthorizationCode: 60,
      Interaction: 120,
      RefreshToken: 14 * 24 * 60 * 60,
    },
  };
};

export default claims;
