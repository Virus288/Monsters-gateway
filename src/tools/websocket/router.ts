import type * as types from '../../types';
import type { IGetMessageBody, IReadMessageBody, ISocketSendMessageBody } from '../../types';
import * as errors from '../../errors';
import * as enums from '../../enums';
import { EConnectionType, EServices } from '../../enums';
import State from '../state';
import Validation from './validation';

export default class Router {
  private readonly _validator: Validation;

  constructor() {
    this._validator = new Validation();
  }

  private get validator(): Validation {
    return this._validator;
  }

  handleChatMessage(message: types.ISocketInMessage, ws: types.ISocket): void {
    this.validator.preValidate(message);

    switch (message.subTarget) {
      case enums.EMessageSubTargets.Send:
        return this.sendMessage(message.payload as ISocketSendMessageBody, ws);
      case enums.EMessageSubTargets.Read:
        return this.readMessage(message.payload as IReadMessageBody, ws);
      case enums.EMessageSubTargets.Get:
        return this.getMessage(message.payload as IGetMessageBody, ws);
      case enums.EMessageSubTargets.GetUnread:
        return this.getUnread(message.payload as IGetMessageBody, ws);
      default:
        return this.handleError(new errors.IncorrectTargetError(), ws);
    }
  }

  handleError(err: types.IFullError, ws: types.ISocket): void {
    if (process.env.NODE_END !== 'prod') console.trace(err);
    const { message, code, name } = err;

    const body = JSON.stringify({
      type: enums.ESocketType.Error,
      payload: {
        message,
        code,
        name,
      },
    });
    return ws.send(body);
  }

  private sendMessage(data: ISocketSendMessageBody, ws: types.ISocket): void {
    this.validator.validateSendMessage(data);
    const { message, target } = data;

    const isOnline = State.socket.isOnline(target);
    if (isOnline) State.socket.sendToUser(target, message);

    const prepared: types.ISendMessageDto = {
      body: data.message,
      receiver: data.target,
      sender: ws.userId,
    };

    State.broker.sendLocally(
      enums.EMessageMainTargets.Chat,
      enums.EMessageSubTargets.Send,
      { target: EConnectionType.Socket, res: ws.userId },
      prepared,
      EServices.Messages,
    );
  }

  private readMessage(data: IReadMessageBody, ws: types.ISocket): void {
    this.validator.validateReadMessage(data);

    State.broker.sendLocally(
      enums.EMessageMainTargets.Chat,
      enums.EMessageSubTargets.Read,
      { target: EConnectionType.Socket, res: ws.userId },
      { ...data, user: ws.userId },
      EServices.Messages,
    );
  }

  private getMessage(data: IGetMessageBody, ws: types.ISocket): void {
    this.validator.validateGetMessage(data);

    State.broker.sendLocally(
      enums.EMessageMainTargets.Chat,
      enums.EMessageSubTargets.Get,
      { target: EConnectionType.Socket, res: ws.userId },
      data,
      EServices.Messages,
    );
  }

  private getUnread(data: IGetMessageBody, ws: types.ISocket): void {
    this.validator.validateGetMessage(data);

    State.broker.sendLocally(
      enums.EMessageMainTargets.Chat,
      enums.EMessageSubTargets.GetUnread,
      { target: EConnectionType.Socket, res: ws.userId },
      data,
      EServices.Messages,
    );
  }
}
