import type * as enums from '../enums';
import type { Locals } from 'express';
import type express from 'express';

export interface IUsersTokens {
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
