import Broker from '../../../src/broker';
import Router from '../../../src/structure';
import State from '../../../src/tools/state';

export default class Utils {
  constructor() {
    State.broker = new Broker();
    State.router = new Router();
  }

  async init(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.init();
      State.router.init();

      setTimeout(() => {
        resolve(undefined);
      }, 4000);
    });
  }

  async close(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.close();
      State.router.close();

      setTimeout(() => {
        resolve(undefined);
      }, 3000);
    });
  }
}
