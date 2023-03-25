import type * as types from '../../types';
import type Websocket from 'ws';
import * as errors from '../../errors';
import * as enums from '../../enums';
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

  handleMessage(message: types.ISocketInMessage, ws: Websocket.WebSocket): void {
    switch (message.subTarget) {
      case enums.EMessageSubTargets.SendMessage:
        return this.sendMessage(message.payload);
      case undefined:
        return this.handleError(new errors.IncorrectTargetError(), ws);
    }
  }

  handleError(err: types.IFullError, ws: Websocket.WebSocket): void {
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

  private sendMessage(data: types.ISocketSendMessage): void {
    this.validator.validateSendMessage(data);
    const { message, target } = data;

    const isOnline = State.socket.isOnline(target);
    if (!isOnline) {
      // Send req to server in order to ask if user does exist. Keep in mind that you'll have to keep whole message payload in rabbit's class memory for as long as service does not response
      // Add fetching user from redis. Even if selected user goes offline, redis should still have his id valid for at least 30m
    }
    return State.socket.sendToUser(target, message);
  }
}
