import State from '../../src/state';
import FakeBroker from './mocks/broker';
import FakeRedis from './mocks/redis';
import Router from '../../src/structure';
import SocketServer from './mocks/websocket';
import FakeMysql from './mocks/FakeMysql';

export default class Utils {
  constructor() {
    State.broker = new FakeBroker();
    State.router = new Router();
    State.socket = new SocketServer();
    State.redis = new FakeRedis();
    State.mysql = new FakeMysql();
  }

  async connect(): Promise<void> {
    State.socket.init();
    await State.router.init();
  }

  async close(): Promise<void> {
    State.router.close();
    State.socket.close();
  }
}
