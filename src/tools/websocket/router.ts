import Validation from './validation';
import * as enums from '../../enums';
import { ESocketType, EUserTypes } from '../../enums';
import * as errors from '../../errors';
import Log from '../logger/log';
import State from '../state';
import type * as types from './types';
import type { IFullError } from '../../types';

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
        return this.sendMessage(message.payload as types.ISocketSendMessageBody, ws);
      case enums.EMessageSubTargets.Read:
        return this.readMessage(message.payload as types.IReadMessageBody, ws);
      case enums.EMessageSubTargets.Get:
        return this.getMessage(message.payload as types.IGetMessageBody, ws);
      case enums.EMessageSubTargets.GetUnread:
        return this.getUnread(message.payload as types.IGetMessageBody, ws);
      default:
        return this.handleError(new errors.IncorrectTargetError(), ws);
    }
  }

  handleError(err: IFullError, ws: types.ISocket): void {
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

  private sendMessage(data: types.ISocketSendMessageBody, ws: types.ISocket): void {
    this.validator.validateSendMessage(data);
    const prepared: types.ISendMessageDto = {
      body: data.message,
      receiver: data.target,
      sender: ws.userId,
    };

    ws.reqHandler.chat
      .send(prepared, { userId: ws.userId, tempId: '', type: EUserTypes.User, validated: true })
      .then(() => {
        ws.send(JSON.stringify({ type: ESocketType.Confirmation } as types.ISocketOutMessage));

        const { message, target } = data;
        const isOnline = State.socket.isOnline(target);
        if (isOnline) State.socket.sendToUser(target, message);
      })
      .catch((err) => {
        Log.error('Socket send message error', err);
        ws.send(JSON.stringify({ type: ESocketType.Error, payload: err } as types.ISocketOutMessage));
      });
  }

  private readMessage(data: types.IReadMessageBody, ws: types.ISocket): void {
    this.validator.validateReadMessage(data);

    ws.reqHandler.chat
      .read(data, { userId: ws.userId, tempId: '', type: EUserTypes.User, validated: true })
      .then(() => {
        ws.send(JSON.stringify({ type: ESocketType.Confirmation } as types.ISocketOutMessage));
      })
      .catch((err) => {
        Log.error('Socket read message error', err);
        ws.send(JSON.stringify({ type: ESocketType.Error, payload: err } as types.ISocketOutMessage));
      });
  }

  private getMessage(data: types.IGetMessageBody, ws: types.ISocket): void {
    this.validator.validateGetMessage(data);

    ws.reqHandler.chat
      .get(data, { userId: ws.userId, tempId: '', type: EUserTypes.User, validated: true })
      .then((callback) => {
        ws.send(
          JSON.stringify({
            type: ESocketType.Confirmation,
            payload: callback.payload,
          } as types.ISocketOutMessage),
        );
      })
      .catch((err) => {
        Log.error('Socket get messages error', err);
        ws.send(JSON.stringify({ type: ESocketType.Error, payload: err } as types.ISocketOutMessage));
      });
  }

  private getUnread(data: types.IGetMessageBody, ws: types.ISocket): void {
    this.validator.validateGetMessage(data);

    ws.reqHandler.chat
      .getUnread(data, { userId: ws.userId, tempId: '', type: EUserTypes.User, validated: true })
      .then((callback) => {
        ws.send(
          JSON.stringify({
            type: ESocketType.Confirmation,
            payload: callback.payload,
          } as types.ISocketOutMessage),
        );
      })
      .catch((err) => {
        Log.error('Socket get unread messages error', err);
        ws.send(JSON.stringify({ type: ESocketType.Error, payload: err } as types.ISocketOutMessage));
      });
  }
}
