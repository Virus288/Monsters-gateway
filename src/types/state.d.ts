import type Broker from '../broker';
import type Router from '../structure';

export interface IState {
  broker: Broker;
  router: Router;
}

export interface IConfigInterface {
  amqpURI: string;
  accessToken: string;
  refToken: string;
  corsOrigin: string | string[];
  httpPort: number;
  socketPort: number;
  redisTestURI: string;
  redisURI: string;
  mysql: {
    user: string;
    password: string;
    host: string;
    db: string;
  };
  session: {
    secret: string;
    secured: boolean;
  };
}
