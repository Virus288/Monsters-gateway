import { afterAll, beforeAll } from '@jest/globals';
import Utils from './connection';

const utils = new Utils();

beforeAll(async () => {
  await utils.init();
});

afterAll(async () => {
  await utils.close();
});

export { utils };
