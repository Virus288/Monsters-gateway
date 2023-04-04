import type Router from '../structure';
import type Broker from '../broker';

export interface IState {
  broker: Broker;
  router: Router;
}

export interface IConfigInterface {
  amqpURI: string;
  accessToken: string;
  refToken: string;
  corsOrigin: string;
  httpPort: number;
  socketPort: number;
}
