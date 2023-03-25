import type { ISocketSendMessage } from '../../types';
import * as errors from '../../errors';

export default class Validation {
  validateSendMessage(data: ISocketSendMessage): void {
    if (data === undefined) throw new errors.MissingArgError('payload');
    if (data.message === undefined) throw new errors.MissingArgError('message');
    if (data.target === undefined) throw new errors.MissingArgError('target');

    const { message, target } = data;
    if (target.length !== 24) throw new errors.IncorrectArgError('Target is not valid mongoose id');
    if (message.length > 200) throw new errors.IncorrectArgError('Message length should ne exceed 200 characters');
  }
}
