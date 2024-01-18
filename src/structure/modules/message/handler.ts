import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type * as getTypes from './get/types';
import type { IUnreadMessage } from './getUnread/types';
import type { EMessageTypes } from '../../../enums';
import type { IUsersTokens } from '../../../types';
import type GetMessagesDto from '../../modules/message/get/dto';
import type GetUnreadMessagesDto from '../../modules/message/getUnread/dto';
import type ReadMessagesDto from '../../modules/message/read/dto';
import type SendMessagesDto from '../../modules/message/send/dto';

export default class Message extends ReqHandler {
  async send(data: SendMessagesDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Messages, enums.EMessageTargets.Send, locals, data);
  }

  async read(data: ReadMessagesDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Messages, enums.EMessageTargets.Read, locals, data);
  }

  async getUnread(
    data: GetUnreadMessagesDto,
    locals: IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUnreadMessage[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Messages,
      enums.EMessageTargets.GetUnread,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUnreadMessage[];
    };
  }

  async get(
    data: GetMessagesDto,
    locals: IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: Record<string, getTypes.IPreparedMessagesBody> | getTypes.IFullMessageEntity[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Messages,
      enums.EMessageTargets.Get,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: Record<string, getTypes.IPreparedMessagesBody> | getTypes.IFullMessageEntity[];
    };
  }
}
