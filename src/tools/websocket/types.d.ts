import type { IGetMessageDto, IReadMessageDto } from './dto';
import type * as enums from '../../enums';
import type { WebSocket } from 'ws';

export interface ISendMessageDto {
  body: string;
  receiver: string;
  sender: string;
}

export interface ISocketPayload {
  [enums.EMessageSubTargets.Send]: ISendMessageDto;
  [enums.EMessageSubTargets.Get]: IGetMessageDto;
  [enums.EMessageSubTargets.Read]: IReadMessageDto;
  [enums.EMessageSubTargets.GetUnread]: IGetMessageDto;
}

export interface ISocket extends WebSocket {
  userId: string;
}

export interface ISocketSubTargets {
  [enums.ESocketTargets.Chat]: enums.EMessageSubTargets;
}

export interface ISocketInMessage {
  target: enums.ESocketTargets;
  subTarget: ISocketSubTargets[enums.ESocketTargets];
  payload: ISocketPayload[enums.ESocketTargets];
}

export interface ISocketUser {
  clients: ISocket[];
  userId: string;
  type: enums.EUserTypes;
}

export interface ISocketOutMessage {
  type: enums.ESocketType;
  payload: unknown;
}

export interface ISocketSendMessageBody {
  target: string;
  message: string;
}

export interface IReadMessageBody {
  chatId: string;
  user: string;
}

export interface IGetDetailedBody {
  page: number;
  target: string;
}

export interface IGetMessageBody {
  page: number;
}
