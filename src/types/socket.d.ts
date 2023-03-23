import type { WebSocket } from 'ws';
import type * as enums from '../enums';

export interface ISocketInMessage {
  target: enums.ESocketTargets;
  subTarget: ISocketSubTargets[enums.ESocketTargets];
  payload: ISocketPayload[enums.ESocketTargets];
}

export interface ISocketUser {
  user: ISocket;
  userId: string;
  type: enums.EUserTypes;
}

export interface ISocketSubTargets {
  [enums.ESocketTargets.Messages]: enums.EMessageSubTargets;
}

export interface ISocketPayload {
  [enums.ESocketTargets.Messages]: ISocketSendMessage;
}

export interface ISocketSendMessage {
  target: string;
  message: string;
}

export interface ISocket extends WebSocket {
  userId?: string;
}

export interface ISocketOutMessage {
  type: enums.ESocketType;
  payload: unknown;
}
