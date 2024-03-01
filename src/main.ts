import Broker from './connections/broker';
import Mysql from './connections/mysql';
import Redis from './connections/redis';
import WebsocketServer from './connections/websocket';
import State from './state';
import Router from './structure';
import Log from './tools/logger';
import type { IFullError } from './types';

class App {
  init(): void {
    this.handleInit().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.error('Server', 'Err while initializing app');
      Log.error('Server', message, stack);
      Log.error('Server', err);

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
    const mysql = new Mysql();

    State.router = router;
    State.broker = broker;
    State.socket = socket;
    State.mysql = mysql;
    State.redis = redis;

    mysql.init();
    await broker.init();
    await redis.init();
    await router.init();
    socket.init();
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
