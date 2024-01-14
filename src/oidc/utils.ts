import * as jose from 'node-jose';
import type { JSONWebKey } from 'jose';

export const generateKey = async (): Promise<JSONWebKey> => {
  const keystore = jose.JWK.createKeyStore();
  const key = await keystore.generate('RSA', 2048, { alg: 'RS256' });
  return key.toJSON(true) as JSONWebKey;
};

export const getKeys = async (amount: number): Promise<JSONWebKey[]> => {
  const keys: JSONWebKey[] = [];
  const actions: (() => Promise<void>)[] = [];

  for (let i = 0; i < amount; i++) {
    actions.push(async () => {
      keys.push(await generateKey());
    });
  }
  await Promise.allSettled(actions.map((a) => a()));

  return keys;
};
