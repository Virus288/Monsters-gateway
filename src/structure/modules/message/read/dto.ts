import Validation from '../../../../tools/validation';
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
    new Validation(this.chatId, 'chatId').isDefined();
    new Validation(this.receiver, 'receiver').isDefined();
  }
}
