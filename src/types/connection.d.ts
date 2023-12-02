import type * as types from './index';
import type * as enums from '../enums';
import type InventoryDropDto from '../structure/modules/inventory/drop/dto';
import type InventoryAddDto from '../structure/modules/inventory/use/dto';
import type GetMessagesDto from '../structure/modules/message/get/dto';
import type GetUnreadMessagesDto from '../structure/modules/message/getUnread/dto';
import type { IGetUnreadMessagesDto } from '../structure/modules/message/getUnread/types';
import type ReadMessagesDto from '../structure/modules/message/read/dto';
import type SendMessagesDto from '../structure/modules/message/send/dto';
import type GetPartyDto from '../structure/modules/party/get/dto';
import type AddProfileDto from '../structure/modules/profile/add/dto';
import type GetProfileDto from '../structure/modules/profile/get/dto';
import type UserDetailsDto from '../structure/modules/user/details/dto';
import type LoginDto from '../structure/modules/user/login/dto';
import type RegisterDto from '../structure/modules/user/register/dto';
import type RemoveUserDto from '../structure/modules/user/remove/dto';
import type { IGetMessageBody, IReadMessageBody, ISendMessageDto } from '../tools/websocket/types';

export type IRabbitSubTargets =
  | enums.EProfileTargets
  | enums.EUserTargets
  | enums.EItemsTargets
  | enums.EPartyTargets
  | enums.EMessageTargets
  | enums.EChatTargets;

export interface IProfileConnectionData {
  [enums.EProfileTargets.Get]: GetProfileDto;
  [enums.EProfileTargets.Create]: AddProfileDto;
}

export interface IUserConnectionData {
  [enums.EUserTargets.Login]: LoginDto;
  [enums.EUserTargets.GetName]: UserDetailsDto;
  [enums.EUserTargets.Register]: RegisterDto;
  [enums.EUserTargets.Remove]: RemoveUserDto;
}

export interface IInventoryConnectionData {
  [enums.EItemsTargets.Drop]: InventoryDropDto;
  [enums.EItemsTargets.Get]: null;
  [enums.EItemsTargets.Use]: InventoryAddDto;
}

export interface IPartyConnectionData {
  [enums.EPartyTargets.Get]: GetPartyDto;
}

export interface IMessageConnectionData {
  [enums.EMessageTargets.Get]: GetMessagesDto;
  [enums.EMessageTargets.GetUnread]: GetUnreadMessagesDto;
  [enums.EMessageTargets.Read]: ReadMessagesDto;
  [enums.EMessageTargets.Send]: SendMessagesDto;
}

export interface IChatConnectionData {
  [enums.EChatTargets.Get]: IGetMessageBody;
  [enums.EChatTargets.GetUnread]: IGetUnreadMessagesDto;
  [enums.EChatTargets.Read]: IReadMessageBody;
  [enums.EChatTargets.Send]: ISendMessageDto;
}

export interface IRabbitConnectionData
  extends IUserConnectionData,
    IProfileConnectionData,
    IPartyConnectionData,
    IMessageConnectionData,
    IChatConnectionData,
    IInventoryConnectionData {}

export type IRabbitTargets = enums.EMessageTypes | enums.EUserMainTargets;

export interface IRabbitMessage {
  user:
    | {
        tempId: string;
        userId: string | undefined;
        validated: boolean;
        type: enums.EUserTypes;
      }
    | undefined;
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
  string,
  {
    resolve: (
      value:
        | { type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send; payload: unknown }
        | PromiseLike<{
            type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
            payload: unknown;
          }>,
    ) => void;
    reject: (reason?: unknown) => void;
    target: enums.EServices;
  }
>;
