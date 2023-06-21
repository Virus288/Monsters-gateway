import { afterAll, beforeAll } from '@jest/globals';
import Connection from './connection';
import Utils from './utils';

const connection = new Connection();
const utils = new Utils();

beforeAll(async () => {
  await connection.connect();
  await utils.sleep(2000);
});

afterAll(async () => {
  await connection.close();
  await utils.sleep(1000);
});

export default { connection };
