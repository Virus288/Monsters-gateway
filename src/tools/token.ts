import type express from 'express';
import jwt from 'jsonwebtoken';
import * as errors from '../errors';
import * as enums from '../enums';
import { jwtTime } from '../enums';
import type * as types from '../types';
import getConfig from './configLoader';
import handleErr from '../errors/utils';

export const verify = (res: types.ILocalUser, token: string): { id: string; type: enums.EUserTypes } => {
  if (!token) throw new errors.Unauthorized();
  const payload = jwt.verify(token, getConfig().accessToken) as {
    id: string;
    type: enums.EUserTypes;
  };

  res.locals.userId = payload.id;
  res.locals.type = payload.type;
  res.locals.validated = true;
  return payload;
};

export const generateToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().accessToken, {
    expiresIn: jwtTime.TokenMaxAge,
  });
};

export const validateAdmin = (_req: express.Request, res: types.ILocalUser, next: express.NextFunction): void => {
  if (!res.locals.validated || res.locals.type !== enums.EUserTypes.Admin) {
    return handleErr(new errors.Unauthorized(), res);
  }
  next();
};

export const validateUser = (_req: express.Request, res: types.ILocalUser, next: express.NextFunction): void => {
  if (!res.locals.validated) {
    return handleErr(new errors.Unauthorized(), res);
  }
  next();
};
