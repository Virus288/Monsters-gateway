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

  async init(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.init();
      State.socket.init();
      State.router.init();
      State.redis.startTestServer();
      State.redis
        .init()
        .then(() => {
          setTimeout(() => {
            resolve(undefined);
          }, 3000);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  async close(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.close();
      State.router.close();
      State.socket.close();
      State.redis.close();
      resolve(undefined);
    });
  }
}
