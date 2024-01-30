import type * as enums from '../enums';
import type ReqHandler from '../structure/reqHandler';
import type { Locals } from 'express';
import type session from 'express-session';

export interface IUsersTokens extends Locals {
  reqHandler: ReqHandler;
  userId: string | undefined;
  tempId: string;
  validated: boolean;
  newToken?: string;
  type: enums.EUserTypes;

  [key: string]: unknown;
}

export interface IUserCredentials {
  id: string;
}

export interface IUserSession extends session.Session, Partial<session.SessionData> {
  userId: string;
}

export interface IUserEntity {
  _id: string;
  login: string;
  verified: boolean;
}
