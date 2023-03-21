import type { WebSocket } from 'ws';
import type * as enums from '../enums';

export interface ISocketMessage {
  target: enums.ESocketTargets;
  subTarget: ISocketSubTargets[enums.ESocketTargets];
  payload: string;
}

export interface ISocketUser {
  user: ISocket;
  userId: string;
  type: enums.EUserTypes;
}

export interface ISocketSubTargets {
  [enums.ESocketTargets.Messages]: enums.EMessageSubTargets;
}

export interface ISocket extends WebSocket {
  userId?: string;
}
