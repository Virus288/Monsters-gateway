import jwt from 'jsonwebtoken';
import getConfig from './configLoader';
import { jwtTime } from '../enums';
import * as errors from '../errors';
import type * as enums from '../enums';
import type * as types from '../types';

export const verify = (res: types.ILocalUser, token: string | null): { id: string; type: enums.EUserTypes } => {
  if (!token) throw new errors.UnauthorizedError();
  const payload = jwt.verify(token, getConfig().accessToken) as {
    id: string;
    type: enums.EUserTypes;
  };

  res.locals.userId = payload.id;
  res.locals.type = payload.type;
  res.locals.validated = true;
  return payload;
};

export const verifyRefresh = (res: types.ILocalUser, token: string | null): { id: string; type: enums.EUserTypes } => {
  if (!token) throw new errors.UnauthorizedError();
  const payload = jwt.verify(token, getConfig().refToken) as {
    id: string;
    type: enums.EUserTypes;
  };

  res.locals.userId = payload.id;
  res.locals.type = payload.type;
  res.locals.validated = true;
  return payload;
};

export const generateToken = (id: string | undefined, type: enums.EUserTypes): string => {
  if (!id) throw new errors.IncorrectTokenError();
  return jwt.sign({ id, type }, getConfig().accessToken, {
    expiresIn: jwtTime.TokenMaxAge,
  });
};
