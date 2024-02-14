import * as jose from 'node-jose';
import Log from './logger/log';
import * as errors from '../errors';
import { InternalError } from '../errors';
import State from '../state';
import type { ITokenPayload } from '../types';
import type { AdapterPayload } from 'oidc-provider';
import type Provider from 'oidc-provider';

export const validateToken = async (token: string | undefined): Promise<ITokenPayload> => {
  if (!token) throw new errors.UnauthorizedError();

  const keyStore = await jose.JWK.asKeyStore({ keys: State.keys });
  const verifier = jose.JWS.createVerify(keyStore);
  const payload = JSON.parse((await verifier.verify(token)).payload.toString()) as ITokenPayload;
  await verifier.verify(token);

  if (new Date(payload.exp * 1000) < new Date()) {
    // Token expired
    throw new errors.UnauthorizedError();
  }
  return payload;
};

export const revokeUserToken = async (provider: Provider, token: string | undefined): Promise<void> => {
  try {
    const payload = await validateToken(token);
    const userToken = (await provider.AccessToken.adapter.find(payload.jti)) as AdapterPayload;

    if (userToken) {
      const prefix = 'oidc:';
      const key = `${prefix}OidcIndex:${userToken.accountId}`;
      const refreshToken = await State.redis.getOidcHash(key, 'RefreshToken');
      const accessToken = await State.redis.getOidcHash(key, 'AccessToken');

      if (refreshToken) await State.redis.removeOidcElement(`${prefix}RefreshToken:${refreshToken.replace(/"/gu, '')}`);
      if (accessToken) await State.redis.removeOidcElement(`${prefix}AccessToken:${accessToken.replace(/"/gu, '')}`);
      if (accessToken ?? refreshToken) {
        await State.redis.removeOidcElement(`${prefix}GrantId:${userToken.grantId}`);
      }

      await State.redis.removeOidcElement(key);
    } else {
      Log.error(
        'Revoking user token',
        'Got req to revoke user token, but token does not exist in redis. How is it possible ?',
        {
          userId: payload.sub,
        },
      );
    }
  } catch (err) {
    Log.error('Revoking user token', err);
    throw new InternalError();
  }
};
