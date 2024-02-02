import * as jose from 'node-jose';
import * as errors from '../errors';
import State from '../state';
import type { ITokenPayload } from '../types';

// eslint-disable-next-line import/prefer-default-export
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

  // Validate if user's token is still active, but account got removed
  const user = await State.redis.getRemovedUsers(payload.sub);
  if (user) throw new errors.UnauthorizedError();

  return payload;
};
