import State from '../../src/tools/state';
import Broker from '../../src/broker';

export default class Utils {
  async init(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker = new Broker();
      State.broker.init();
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  }

  async close(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.close();
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}
