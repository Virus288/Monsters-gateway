import * as enums from '../../enums';
import ReqHandler from '../../tools/abstracts/reqHandler';
import type {
  IFullChatMessageEntity,
  IGetMessageBody,
  IReadMessageBody,
  ISendMessageDto,
} from '../../connections/websocket/types';
import type { EMessageTypes } from '../../enums';
import type { IPreparedMessagesBody } from '../modules/message/get/types';
import type { IGetUnreadMessagesDto, IUnreadMessage } from '../modules/message/getUnread/types';

export default class Chat extends ReqHandler {
  async send(
    data: ISendMessageDto,
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
    data: IReadMessageBody,
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
    data: IGetMessageBody,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: Record<string, IPreparedMessagesBody> | IFullChatMessageEntity[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Messages,
      enums.EChatTargets.Get,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: Record<string, IPreparedMessagesBody> | IFullChatMessageEntity[];
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
      enums.EUserMainTargets.Messages,
      enums.EChatTargets.GetUnread,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUnreadMessage[];
    };
  }
}
