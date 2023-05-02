import Broker from '../../../src/broker';
import Router from '../../../src/structure';
import State from '../../../src/tools/state';
import WebsocketServer from '../../../src/tools/websocket';

export default class Utils {
  constructor() {
    State.broker = new Broker();
    State.router = new Router();
    State.socket = new WebsocketServer();
  }

  async init(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.init();
      State.socket.init();
      State.router.init();

      setTimeout(() => {
        resolve(undefined);
      }, 3000);
    });
  }

  async close(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.close();
      State.router.close();
      State.socket.close();
      resolve(undefined);
    });
  }
}
