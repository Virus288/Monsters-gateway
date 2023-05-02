import type { ISocketInMessage, ISocketSendMessage } from '../../types';
import * as errors from '../../errors';
import type { IGetMessageDto, IReadMessageDto } from './types/dto';

export default class Validation {
  preValidate(data: ISocketInMessage): void {
    if (data.payload === undefined) throw new errors.MissingArgError('payload');
  }

  validateSendMessage(data: ISocketSendMessage): void {
    if (data.message === undefined) throw new errors.MissingArgError('message');
    if (data.target === undefined) throw new errors.MissingArgError('target');

    const { message, target } = data;
    if (target.length !== 24) throw new errors.IncorrectArgError('Target is not valid mongoose id');
    if (message.length > 200) throw new errors.IncorrectArgError('Message length should ne exceed 200 characters');
  }

  validateReadMessage(data: IReadMessageDto): void {
    if (data.chatId === undefined) throw new errors.MissingArgError('chatId');

    const { chatId } = data;
    if (chatId.length !== 24) throw new errors.IncorrectArgError('Id is not valid mongoose id');
  }

  validateGetMessage(data: IGetMessageDto): void {
    if (data.page === undefined) throw new errors.MissingArgError('page');

    const { page } = data;
    if (typeof page !== 'number') throw new errors.IncorrectArgError('Page is not number');
  }
}
