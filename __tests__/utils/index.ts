import State from '../../src/tools/state';
import Broker from '../../src/broker';
import jwt from 'jsonwebtoken';
import getConfig from '../../src/tools/configLoader';
import * as types from '../../src/enums';
import * as enums from '../../src/enums';

export default class Utils {
  async init(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker = new Broker();
      State.broker.init();
      setTimeout(() => {
        resolve(undefined);
      }, 4000);
    });
  }

  async close(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
      State.broker.close();
      setTimeout(() => {
        resolve(undefined);
      }, 3000);
    });
  }

  generateAccessToken = (id: string, type: types.EUserTypes): string => {
    return jwt.sign({ id, type }, getConfig().accessToken, {
      expiresIn: enums.EJwtTime.TokenMaxAge,
    });
  };
}
