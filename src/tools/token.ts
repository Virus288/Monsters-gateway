import * as jose from 'node-jose';
import Log from './logger/log';
import * as errors from '../errors';
import { InternalError, IncorrectTokenError } from '../errors';
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

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'testDev') {
      const cachedToken = await State.redis.getOidcHash(`oidc:AccessToken:${payload.jti}`, payload.jti);

      if (!cachedToken) {
        Log.error(
          'User tried to log in using token, which does not exists in redis. Might just expired between validation and redis',
        );
        throw new IncorrectTokenError();
      }
      const t = JSON.parse(cachedToken) as AdapterPayload;
      if (Date.now() - new Date((t.exp as number) * 1000).getTime() > 0) {
        Log.error('User tried to log in using expired token, which for some reason is in redis', {
          token: payload.jti,
        });
        throw new IncorrectTokenError();
      }
    }

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
