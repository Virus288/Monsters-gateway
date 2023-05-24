import * as errors from '../../../../errors';
import type { ISendMessageDto } from './types';

export default class SendMessagesDto implements ISendMessageDto {
  body: string;
  receiver: string;
  sender: string;

  constructor(body: ISendMessageDto, sender: string) {
    this.body = body.body;
    this.receiver = body.receiver;
    this.sender = sender;

    this.validate();
  }

  validate(): void {
    if (!this.body) throw new errors.MissingArgError('body');
    if (!this.receiver) throw new errors.MissingArgError('receiver');
  }
}
