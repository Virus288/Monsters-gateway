import jwt from 'jsonwebtoken';
import getConfig from '../../src/tools/configLoader';
import * as types from '../../src/enums';
import * as enums from '../../src/enums';

export default class Utils {
  generateAccessToken = (id: string, type: types.EUserTypes): string => {
    return jwt.sign({ id, type }, getConfig().accessToken, {
      expiresIn: enums.EJwtTime.TokenMaxAge,
    });
  };
}
