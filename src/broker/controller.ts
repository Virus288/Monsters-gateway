import type * as types from '../types';
import type { EServices } from '../enums';
import * as enums from '../enums';
import type amqplib from 'amqplib';
import type { FullError } from '../errors';
import { InternalError } from '../errors';
import Log from '../tools/logger/log';
import { generateTempId } from '../utils';

export default class Communicator {
  private _queue: Record<string, { user: types.ILocalUser; target: enums.EServices }> = {};

  get queue(): Record<string, { user: types.ILocalUser; target: EServices }> {
    return this._queue;
  }

  set queue(value: Record<string, { user: types.ILocalUser; target: EServices }>) {
    this._queue = value;
  }

  sendLocally(
    target: types.IRabbitTargets,
    subTarget: types.IRabbitSubTargets,
    res: types.ILocalUser,
    payload: unknown,
    service: enums.EServices,
    channel: amqplib.Channel,
  ): void {
    const { validated, type, userId } = res.locals;

    const tempId = generateTempId();
    res.locals.tempId = tempId;
    this.queue[res.locals.userId ?? res.locals.tempId] = { user: res, target: service };
    const body: types.IRabbitMessage = {
      user: {
        userId: userId,
        tempId: userId !== undefined ? userId : tempId,
        validated,
        type,
      },
      payload,
      target,
      subTarget,
    };
    switch (service) {
      case enums.EServices.Users:
        channel.sendToQueue(enums.EAmqQueues.Users, Buffer.from(JSON.stringify(body)));
        return;
    }
  }

  sendHeartbeat = (channel: amqplib.Channel, target: enums.EServices): void => {
    const body: types.IRabbitMessage = {
      user: undefined,
      payload: undefined,
      subTarget: undefined,
      target: enums.EMessageTypes.Heartbeat,
    };

    switch (target) {
      case enums.EServices.Users:
        channel.sendToQueue(enums.EAmqQueues.Users, Buffer.from(JSON.stringify(body)));
        return;
      case enums.EServices.Messages:
        channel.sendToQueue(enums.EAmqQueues.Messages, Buffer.from(JSON.stringify(body)));
        return;
    }
  };

  sendExternally(payload: types.IRabbitMessage): void {
    Log.log('Server', 'Got new message');
    Log.log('Server', JSON.stringify(payload));
    const target = this.queue[payload.user.tempId];
    delete this.queue[payload.user.tempId];

    switch (payload.target) {
      case enums.EMessageTypes.Error:
        return this.sendError(payload.payload as FullError, target.user);
      case enums.EMessageTypes.Credentials:
        return this.setTokens(payload.payload as types.IUserCredentials, target.user);
      case enums.EMessageTypes.Send:
        return this.send(payload.payload as string, target.user);
      default:
        throw new Error('Unknown message target');
    }
  }

  fulfillDeadQueue(target: types.IAvailableServices): void {
    const { message, code, name, status } = new InternalError();
    const users = Object.entries(this.queue).filter((user) => {
      return user[1].target === target;
    });
    users.forEach((user) => {
      user[1].user.status(status).send(JSON.stringify({ message, code, name }));
      delete this.queue[user[0]];
    });
  }

  private setTokens(payload: types.IUserCredentials, target: types.ILocalUser): void {
    const { refreshToken, accessToken } = payload;
    target.cookie(enums.EJwt.AccessToken, accessToken, { httpOnly: true, maxAge: enums.EJwtTime.TokenMaxAge * 1000 });
    target.status(200).send({ refreshToken, eol: Date.now() + enums.EJwtTime.RefreshTokenMaxAge * 1000 });
  }

  private send(body: string, target: types.ILocalUser): void {
    target.send(body);
  }

  private sendError(err: FullError, target: types.ILocalUser): void {
    const { message, code, name, status } = err;
    target.status(status).send(JSON.stringify({ message, code, name }));
  }
}
