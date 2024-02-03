import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type * as getTypes from './get/types';
import type { IUnreadMessage } from './getUnread/types';
import type { EMessageTypes } from '../../../enums';
import type { IUserBrokerInfo } from '../../../types';
import type GetMessagesDto from '../../modules/message/get/dto';
import type GetUnreadMessagesDto from '../../modules/message/getUnread/dto';
import type ReadMessagesDto from '../../modules/message/read/dto';
import type SendMessagesDto from '../../modules/message/send/dto';

export default class Message extends ReqHandler {
  async send(data: SendMessagesDto, userData: IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Message, enums.EMessagesTargets.Send, userData, data);
  }

  async read(data: ReadMessagesDto, userData: IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Message, enums.EMessagesTargets.Read, userData, data);
  }

  async getUnread(
    data: GetUnreadMessagesDto,
    userData: IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUnreadMessage[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Message,
      enums.EMessagesTargets.GetUnread,
      userData,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUnreadMessage[];
    };
  }

  async get(
    data: GetMessagesDto,
    userData: IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: Record<string, getTypes.IPreparedMessagesBody> | getTypes.IFullMessageEntity[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Message,
      enums.EMessagesTargets.Get,
      userData,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: Record<string, getTypes.IPreparedMessagesBody> | getTypes.IFullMessageEntity[];
    };
  }
}
