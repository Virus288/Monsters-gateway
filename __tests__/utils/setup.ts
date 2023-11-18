import { afterAll, afterEach, beforeAll } from '@jest/globals';
import Connection from './connection';
import State from '../../src/tools/state';
import { FakeBroker } from './mocks';

const connection = new Connection();

beforeAll(async () => await connection.connect());

afterEach(() => ((State.broker as FakeBroker).action = undefined));

afterAll(async () => await connection.close());

export default { connection };
