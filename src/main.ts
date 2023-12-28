import Broker from './broker';
import Router from './structure';
import Log from './tools/logger/log';
import Redis from './tools/redis';
import State from './tools/state';
import WebsocketServer from './tools/websocket';
import type { IFullError } from './types';

export default class App {
  init(): void {
    this.handleInit().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      return this.kill();
    });
  }

  async kill(): Promise<void> {
    State.router.close();
    State.broker.close();
    await State.redis.close();
    State.socket.close();
    Log.log('Server', 'Server closed');
  }

  private async handleInit(): Promise<void> {
    const router = new Router();
    const broker = new Broker();
    const socket = new WebsocketServer();
    const redis = new Redis();

    State.router = router;
    State.broker = broker;
    State.socket = socket;
    State.redis = redis;
    await router.init();
    socket.init();
    await broker.init();
    await redis.init();
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
