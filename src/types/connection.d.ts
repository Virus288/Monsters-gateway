import type * as types from './index';
import type { IUsersTokens } from './user';
import type * as enums from '../enums';

export type IRabbitSubTargets =
  | enums.EProfileTargets
  | enums.EUserTargets
  | enums.EMessageSubTargets
  | enums.ESharedTargets
  | enums.EItemsTargets
  | enums.EPartyTargets;

export type IRabbitTargets = enums.EMessageTypes | enums.EUserMainTargets | enums.EMessageMainTargets;

export interface IRabbitMessage {
  user: IUsersTokens | undefined;
  target: IRabbitTargets;
  subTarget: IRabbitSubTargets;
  payload: unknown;
}

export type IAvailableServices = Exclude<enums.EServices, enums.EServices.Gateway>;

export interface IConnectionType {
  [enums.EConnectionType.Socket]: string;
  [enums.EConnectionType.Api]: types.ILocalUser;
}

export interface IWebsocketRabbitTarget {
  id: string;
  tempId: string;
}

export type ICommunicationQueue = Record<
  enums.EConnectionType,
  Record<string, { user: types.ILocalUser | IWebsocketRabbitTarget; target: enums.EServices }>
>;
