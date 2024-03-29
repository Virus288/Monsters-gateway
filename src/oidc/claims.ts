import Adapter from './adapter';
import findAccount from './user';
import type { JSONWebKey } from 'jose';
import type * as oidc from 'oidc-provider';

const claims = (keys: JSONWebKey[], clients: oidc.ClientMetadata[]): oidc.Configuration => {
  return {
    adapter: Adapter,

    claims: {
      openid: ['login'],
    },

    clients,

    cookies: {
      long: {
        maxAge: 60 * 1000,
        signed: true,
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
      },
      revocation: {
        enabled: true,
      },
      rpInitiatedLogout: {
        enabled: true,
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        logoutSource: (ctx: oidc.KoaContextWithOIDC, form: string): oidc.CanBePromise<void | undefined> => {
          ctx.rend;
          ctx.body = `<!DOCTYPE html>
            <head>
              <meta content='text/html; charset=utf-8' http-equiv='Content-Type' />
              <title>Monsters - Logout</title>
              <meta content='width=device-width, initial-scale=1' name='viewport'>
            </head>
            <body>
              ${form}
            </body>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  const form = document.querySelector('form')
                  const input = document.createElement('input')
                  input.type = 'hidden'
                  input.name = 'logout'
                  input.value = 'yes'
                  form.appendChild(input)
                  form.submit()
                });
              </script>
            </html>`;
        },
      },
    },
    formats: {
      AccessToken: 'jwt',
      ClientCredentials: 'jwt',
    },

    issueRefreshToken: (_ctx, client): boolean => {
      return client.grantTypeAllowed('refresh_token');
    },
    expiresWithSession: (): boolean => false,

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
