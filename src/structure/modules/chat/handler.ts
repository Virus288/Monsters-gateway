import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type { IPreparedMessagesBody } from './types';
import type * as types from '../../../connections/websocket/types';
import type { EMessageTypes } from '../../../enums';
import type { IGetUnreadMessagesDto, IUnreadMessage } from '../message/getUnread/types';

export default class Chat extends ReqHandler {
  async send(
    data: types.ISendMessageDto,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
  ): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Chat, enums.EChatTargets.Send, locals, data);
  }

  async read(
    data: types.IReadMessageBody,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
  ): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Chat, enums.EChatTargets.Read, locals, data);
  }

  async get(
    data: types.IGetMessageBody,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: Record<string, IPreparedMessagesBody> | types.IFullChatMessageEntity[];
  }> {
    return (await this.sendReq(this.service, enums.EUserMainTargets.Message, enums.EChatTargets.Get, locals, data)) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: Record<string, IPreparedMessagesBody> | types.IFullChatMessageEntity[];
    };
  }

  async getUnread(
    data: IGetUnreadMessagesDto,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUnreadMessage[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Message,
      enums.EChatTargets.GetUnread,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUnreadMessage[];
    };
  }
}
