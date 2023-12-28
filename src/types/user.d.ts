import type * as enums from '../enums';
import type ReqHandler from '../structure/reqHandler';
import type { Locals } from 'express';

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
  accessToken: string;
  refreshToken: string;
  userId: string;
}
