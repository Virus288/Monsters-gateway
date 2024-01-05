import Adapter from './adapter';
import findAccount from './user';
import type { Response } from 'express';
import type { JSONWebKey } from 'jose';
import type { Configuration } from 'oidc-provider';

const claims = (keys: JSONWebKey[]): Configuration => {
  return {
    adapter: Adapter,

    claims: {
      openid: ['login'],
    },

    clients: [
      {
        client_id: 'client',
        client_secret: 'secret',
        grant_types: ['authorization_code', 'refresh_token'],
        redirect_uris: ['http://localhost:5003/login'],
        scope: 'openid',
      },
    ],

    cookies: {
      long: {
        maxAge: 60 * 1000,
      },
      keys: ['key'],
    },

    extraParams: ['test'],

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
      rpInitiatedLogout: {
        logoutSource: (ctx, form): Promise<undefined> => {
          return new Promise((resolve: (value: Promise<undefined>) => void, reject) => {
            (ctx.res as Response).render(
              'logout',
              {
                form,
                host: ctx.host,
              },
              (err, res) => {
                if (err) {
                  reject(err);
                }
                ctx.body = res;
                resolve(res as unknown as Promise<undefined>);
              },
            );
          });
        },
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

    ttl: {
      AccessToken: 600,
      AuthorizationCode: 60,
      ClientCredentials: 600,
      Interaction: 120,
      RefreshToken: (_ctx, token): number => {
        if ((token as unknown as Record<string, unknown>)?.remember === true) {
          return 57600;
        }
        return 57600;
      },
    },
  };
};

export default claims;
