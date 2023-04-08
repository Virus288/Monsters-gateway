import type { WebSocket } from 'ws';
import type * as enums from '../enums';
import type { IGetMessageDto, IReadMessageDto, ISendMessageDto } from '../tools/websocket/types/dto';

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
  [enums.ESocketTargets.Chat]: enums.EMessageSubTargets;
}

export interface ISocketPayload {
  [enums.EMessageSubTargets.Send]: ISendMessageDto;
  [enums.EMessageSubTargets.Get]: IGetMessageDto;
  [enums.EMessageSubTargets.Read]: IReadMessageDto;
  [enums.EMessageSubTargets.GetUnread]: IGetMessageDto;
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
