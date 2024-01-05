import * as jose from 'node-jose';

export const generateKey = async (): Promise<object> => {
  const keystore = jose.JWK.createKeyStore();
  const key = await keystore.generate('RSA', 2048, { alg: 'RS256' });
  return key.toJSON(true);
};

export const getKeys = async (amount: number): Promise<object[]> => {
  const keys: object[] = [];
  const actions: (() => Promise<void>)[] = [];

  for (let i = 0; i < amount; i++) {
    actions.push(async () => {
      keys.push(await generateKey());
    });
  }
  await Promise.allSettled(actions.map((a) => a()));

  return keys;
};
