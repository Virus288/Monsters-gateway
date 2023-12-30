import Broker from './connections/broker';
import Redis from './connections/redis';
import WebsocketServer from './connections/websocket';
import State from './state';
import Router from './structure';
import Log from './tools/logger/log';
import type { IFullError } from './types';

class App {
  init(): void {
    this.handleInit().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      return State.kill().catch((error) =>
        Log.error('Server', "Couldn't kill server", (error as Error).message, (error as Error).stack),
      );
    });
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
