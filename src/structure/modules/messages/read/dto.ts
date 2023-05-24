import * as errors from '../../../../errors';
import type { IReadMessageDto } from './types';

export default class ReadMessagesDto implements IReadMessageDto {
  chatId: string;
  receiver: string;

  constructor(body: IReadMessageDto) {
    this.chatId = body.chatId;
    this.receiver = body.receiver;

    this.validate();
  }

  validate(): void {
    if (!this.chatId) throw new errors.MissingArgError('chatId');
    if (!this.receiver) throw new errors.MissingArgError('receiver');
  }
}
