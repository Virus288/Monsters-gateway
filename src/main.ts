import Router from './structure';
import State from './tools/state';
import errLogger from './tools/logger/logger';
import Log from './tools/logger/log';
import Broker from './broker';
import WebsocketServer from './tools/websocket';
import Redis from './tools/redis';

export default class App {
  init(): void {
    this.handleInit().catch((err) => {
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', JSON.stringify(err));
      errLogger.error(err);
      errLogger.error(JSON.stringify(err));

      this.kill();
    });
  }

  kill(): void {
    State.router.close();
    State.broker.close();
    State.redis.close();
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
    router.init();
    broker.init();
    socket.init();
    await redis.init();
  }
}

const app = new App();
app.init();
