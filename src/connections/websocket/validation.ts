import Validator from '../../tools/validation';
import type { IGetMessageBody, IReadMessageBody, ISocketInMessage, ISocketSendMessageBody } from './types';

export default class Validation {
  preValidate(data: ISocketInMessage): void {
    new Validator(data.payload, 'payload').isDefined();
  }

  validateSendMessage(data: ISocketSendMessageBody): void {
    new Validator(data.message, 'message').isDefined().isBetween(200);
    new Validator(data.target, 'target').isDefined().isBetween(24, 24);
  }

  validateGetMessage(data: IGetMessageBody): void {
    new Validator(data.page, 'page').isDefined().isNumber();
  }

  validateReadMessage(data: IReadMessageBody): void {
    new Validator(data.chatId, 'chatId').isDefined().isBetween(24, 24);
  }
}
