import type { IUserBrokerInfo } from './user';
import type * as types from '../connections/websocket/types';
import type * as enums from '../enums';
import type ChangeCharacterStatusDto from '../structure/modules/character/changeState/dto';
import type AttackDto from '../structure/modules/fights/attack/dto';
import type CreateFightDto from '../structure/modules/fights/debug/dto';
import type { IGetFightDto } from '../structure/modules/fights/getFights/types';
import type { IGetFightLogsDto } from '../structure/modules/fights/getLogs/types';
import type InventoryDropDto from '../structure/modules/inventory/drop/dto';
import type InventoryAddDto from '../structure/modules/inventory/use/dto';
import type AddLogDto from '../structure/modules/log/add/dto';
import type GetLogDto from '../structure/modules/log/get/dto';
import type GetMessagesDto from '../structure/modules/message/get/dto';
import type GetUnreadMessagesDto from '../structure/modules/message/getUnread/dto';
import type { IGetUnreadMessagesDto } from '../structure/modules/message/getUnread/types';
import type ReadMessagesDto from '../structure/modules/message/read/dto';
import type SendMessagesDto from '../structure/modules/message/send/dto';
import type GetPartyDto from '../structure/modules/party/get/dto';
import type AddProfileDto from '../structure/modules/profile/add/dto';
import type GetProfileDto from '../structure/modules/profile/get/dto';
import type DebugGetAllUsersDto from '../structure/modules/user/debug/dto';
import type UserDetailsDto from '../structure/modules/user/details/dto';
import type LoginDto from '../structure/modules/user/login/dto';
import type RegisterDto from '../structure/modules/user/register/dto';
import type RemoveUserDto from '../structure/modules/user/remove/dto';

export type IRabbitSubTargets =
  | enums.EProfileTargets
  | enums.EUserTargets
  | enums.EItemsTargets
  | enums.EPartyTargets
  | enums.EMessagesTargets
  | enums.EChatTargets
  | enums.EFightsTargets
  | enums.ECharacterStateTargets
  | enums.ELogTargets;

export interface IProfileConnectionData {
  [enums.EProfileTargets.Get]: GetProfileDto;
  [enums.EProfileTargets.Create]: AddProfileDto;
}

export interface IUserConnectionData {
  [enums.EUserTargets.Login]: LoginDto;
  [enums.EUserTargets.GetName]: UserDetailsDto[];
  [enums.EUserTargets.Register]: RegisterDto;
  [enums.EUserTargets.Remove]: RemoveUserDto;
  [enums.EUserTargets.DebugGetAll]: DebugGetAllUsersDto;
}

export interface ILogConnectionData {
  [enums.ELogTargets.GetLog]: GetLogDto;
  [enums.ELogTargets.AddLog]: AddLogDto;
}

export interface IFightConnectionData {
  [enums.EFightsTargets.Leave]: null;
  [enums.EFightsTargets.CreateFight]: CreateFightDto;
  [enums.EFightsTargets.Attack]: AttackDto;
  [enums.EFightsTargets.GetLogs]: IGetFightLogsDto;
  [enums.EFightsTargets.GetFights]: IGetFightDto;
}

export interface IInventoryConnectionData {
  [enums.EItemsTargets.Drop]: InventoryDropDto;
  [enums.EItemsTargets.Get]: null;
  [enums.EItemsTargets.Use]: InventoryAddDto;
}

export interface IPartyConnectionData {
  [enums.EPartyTargets.Get]: GetPartyDto;
}

export interface ICharacterStateConnectionData {
  [enums.ECharacterStateTargets.ChangeState]: ChangeCharacterStatusDto;
}

export interface IMessageConnectionData {
  [enums.EMessagesTargets.Get]: GetMessagesDto;
  [enums.EMessagesTargets.GetUnread]: GetUnreadMessagesDto;
  [enums.EMessagesTargets.Read]: ReadMessagesDto;
  [enums.EMessagesTargets.Send]: SendMessagesDto;
}

export interface IChatConnectionData {
  [enums.EChatTargets.Get]: types.IGetMessageBody;
  [enums.EChatTargets.GetUnread]: IGetUnreadMessagesDto;
  [enums.EChatTargets.Read]: types.IReadMessageBody;
  [enums.EChatTargets.Send]: types.ISendMessageDto;
}

export interface IRabbitConnectionData
  extends IUserConnectionData,
    IProfileConnectionData,
    IPartyConnectionData,
    ICharacterStateConnectionData,
    IMessageConnectionData,
    IChatConnectionData,
    ILogConnectionData,
    IFightConnectionData,
    IInventoryConnectionData {}

export type IRabbitTargets = enums.EMessageTypes | enums.EUserMainTargets;

export interface IRabbitMessage {
  user: IUserBrokerInfo | undefined;
  target: IRabbitTargets;
  subTarget: IRabbitSubTargets;
  payload: unknown;
}

export type IAvailableServices = Exclude<enums.EServices, enums.EServices.Gateway>;

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
