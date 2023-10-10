import type * as enums from '../enums';
import type ReqHandler from '../structure/reqHandler';
import type express, { Locals } from 'express';

export interface IUsersTokens {
  reqHandler: ReqHandler;
  userId: string | undefined;
  tempId: string;
  validated: boolean;
  newToken?: string;
  type: enums.EUserTypes;

  [key: string]: unknown;
}

export interface ILocalUser extends express.Response {
  locals: IUsersTokens & Locals;
}

export interface IUserCredentials {
  accessToken: string;
  refreshToken: string;
  userId: string;
}
