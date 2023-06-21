import Broker from '../../../src/broker';
import Router from '../../../src/structure';
import State from '../../../src/tools/state';
import WebsocketServer from '../../../src/tools/websocket';
import Redis from '../../../src/tools/redis';

export default class Utils {
  constructor() {
    State.broker = new Broker();
    State.router = new Router();
    State.socket = new WebsocketServer();
    State.redis = new Redis();
  }

  async connect(): Promise<void> {
    await this.redis();
    await State.broker.init();
    State.socket.init();
    State.router.init();
  }

  async close(): Promise<void> {
    State.broker.close();
    State.router.close();
    State.socket.close();
    await State.redis.close();
  }

  private async redis(): Promise<void> {
    await State.redis.init();
  }
}
