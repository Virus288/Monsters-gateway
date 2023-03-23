import type { IUsersTokens } from './user';
import type * as enums from '../enums';

export interface IRabbitMessage {
  user: IUsersTokens | undefined;
  target: IRabbitTargets;
  subTarget: IRabbitSubTargets;
  payload: unknown;
}

export type IRabbitTargets = enums.EMessageTypes | enums.EUserMainTargets | enums.EMessageMainTargets;

export type IRabbitSubTargets = enums.EProfileTargets | enums.EUserTargets;

export type IAvailableServices = Exclude<enums.EServices, enums.EServices.Gateway>;
