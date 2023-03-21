import type Router from '../structure';
import Broker from '../broker';

export interface IState {
  broker: Broker;
  router: Router;
}

export interface IConfigInterface {
  amqpURI: string;
  accessToken: string;
  corsOrigin: string;
  httpPort: number;
  socketPort: number;
}
