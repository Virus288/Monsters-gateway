import { afterAll, afterEach, beforeAll } from '@jest/globals';
import Connection from './connection';
import State from '../../src/state';
import { FakeBroker } from './mocks';
import { IBrokerAction } from '../types';

const connection = new Connection();

beforeAll(async () => await connection.connect());

afterEach(async () => ((State.broker as FakeBroker).actions = [] as IBrokerAction[]));

afterAll(async () => await connection.close());

export default { connection };
