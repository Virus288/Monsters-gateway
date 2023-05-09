import type Broker from '../broker';
import type Router from '../structure';
import type { IState } from '../types';
import type WebsocketServer from './websocket';
import type Redis from './redis';

class State implements IState {
  private _broker: Broker;

  get broker(): Broker {
    return this._broker;
  }

  set broker(value: Broker) {
    this._broker = value;
  }

  private _socket: WebsocketServer;

  get socket(): WebsocketServer {
    return this._socket;
  }

  set socket(value: WebsocketServer) {
    this._socket = value;
  }

  private _redis: Redis;

  get redis(): Redis {
    return this._redis;
  }

  set redis(value: Redis) {
    this._redis = value;
  }

  private _router: Router;

  get router(): Router {
    return this._router;
  }

  set router(value: Router) {
    this._router = value;
  }
}

export default new State();
