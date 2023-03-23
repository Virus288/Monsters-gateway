import type { ISocketSendMessage } from '../../types';
import * as errors from '../../errors';

export default class Validation {
  validateSendMessage(data: ISocketSendMessage): void {
    if (data === undefined) throw new errors.MissingArg('payload');
    if (data.message === undefined) throw new errors.MissingArg('message');
    if (data.target === undefined) throw new errors.MissingArg('target');

    const { message, target } = data;
    if (target.length !== 24) throw new errors.IncorrectArg('Target is not valid mongoose id');
    if (message.length > 200) throw new errors.IncorrectArg('Message length should ne exceed 200 characters');
  }
}
