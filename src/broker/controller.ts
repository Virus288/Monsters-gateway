import * as enums from '../enums';
import { EConnectionType, EJwtTime, ESocketType, EUserTypes } from '../enums';
import * as errors from '../errors';
import { InternalError } from '../errors';
import Log from '../tools/logger/log';
import State from '../tools/state';
import { generateTempId } from '../utils';
import type * as types from '../types';
import type amqplib from 'amqplib';

export default class Communicator {
  private _queue: types.ICommunicationQueue = {
    api: {},
    socket: {},
  };

  get queue(): types.ICommunicationQueue {
    return this._queue;
  }

  sendLocally<T extends enums.EConnectionType>(
    target: types.IRabbitTargets,
    subTarget: types.IRabbitSubTargets,
    user: { target: T; res: types.IConnectionType[T] },
    payload: unknown,
    service: enums.EServices,
    channel: amqplib.Channel,
  ): void {
    const tempId = generateTempId();
    const body: types.IRabbitMessage = {
      user: {
        tempId,
        userId: undefined,
        validated: false,
        type: EUserTypes.User,
      },
      payload,
      target,
      subTarget,
    };

    if (user.target === enums.EConnectionType.Api) {
      const localUser = user.res as types.ILocalUser;
      localUser.locals.tempId = tempId;
      this.queue.api[localUser.locals.userId ?? tempId] = { user: localUser, target: service };
      body.user = {
        ...body.user,
        userId: localUser.locals.userId,
        tempId,
        validated: localUser.locals.validated,
        type: localUser.locals.type,
      };
    } else {
      const userTarget = { id: user.res as string, tempId } as types.IWebsocketRabbitTarget;
      this.queue.socket[userTarget.id] = { user: userTarget, target: service };

      body.user = {
        ...body.user,
        userId: userTarget.id,
        tempId,
        validated: true,
        type: EUserTypes.User,
      };
    }

    switch (service) {
      case enums.EServices.Users:
        channel.sendToQueue(enums.EAmqQueues.Users, Buffer.from(JSON.stringify(body)));
        return;
      case enums.EServices.Messages:
        channel.sendToQueue(enums.EAmqQueues.Messages, Buffer.from(JSON.stringify(body)));
        return;
      default:
        throw new Error('Incorrect service target');
    }
  }

  sendHeartbeat = (channel: amqplib.Channel, target: enums.EServices): void => {
    const body: types.IRabbitMessage = {
      user: undefined,
      payload: undefined,
      subTarget: enums.EMessageSubTargets.Send,
      target: enums.EMessageTypes.Heartbeat,
    };

    switch (target) {
      case enums.EServices.Users:
        channel.sendToQueue(enums.EAmqQueues.Users, Buffer.from(JSON.stringify(body)));
        return;
      case enums.EServices.Messages:
        channel.sendToQueue(enums.EAmqQueues.Messages, Buffer.from(JSON.stringify(body)));
        return;
      default:
        throw new Error('Unknown message target');
    }
  };

  sendExternally(payload: types.IRabbitMessage): void {
    Log.log('Server', 'Got new message');
    Log.log('Server', JSON.stringify(payload));
    const target = this.findTarget(payload.user!.userId ?? payload.user!.tempId, true);

    if (target.type === EConnectionType.Socket) {
      return this.sendWs(target.target as types.IWebsocketRabbitTarget, payload);
    }

    const user = target.target as types.ILocalUser;
    switch (payload.target) {
      case enums.EMessageTypes.Error:
        return this.sendError(payload.payload as errors.FullError, user);
      case enums.EMessageTypes.Credentials:
        return this.setTokens(payload.payload as types.IUserCredentials, user);
      case enums.EMessageTypes.Send:
        return this.send(payload.payload as string, user);
      default:
        throw new Error('Unknown message target');
    }
  }

  fulfillDeadQueue(target: types.IAvailableServices): void {
    const { message, code, name, status } = new InternalError();
    const apis = Object.entries(this.queue.api).filter((user) => {
      return user[1].target === target;
    });

    apis.forEach((u) => {
      const user = u[1].user as types.ILocalUser;
      user.status(status).send(JSON.stringify({ message, code, name }));
      delete this.queue.api[u[0]];
    });

    const sockets = Object.entries(this.queue.socket).filter((user) => {
      return user[1].target === target;
    });
    sockets.forEach((s) => {
      const user = s[1].user as types.IWebsocketRabbitTarget;
      State.socket.sendToUser(user.id, { message, code, name, status }, ESocketType.Error);
      delete this.queue.socket[s[0]];
    });
  }

  private sendWs(target: types.IWebsocketRabbitTarget, payload: types.IRabbitMessage): void {
    const user = target;

    switch (payload.target) {
      case enums.EMessageTypes.Error:
        return State.socket.sendToUser(user.id, payload.payload, ESocketType.Error);
      default:
        return State.socket.sendToUser(
          user.id,
          payload.payload,
          payload.payload === undefined ? ESocketType.Confirmation : ESocketType.Message,
        );
    }
  }

  private findTarget(
    target: string,
    remove = false,
  ): {
    type: EConnectionType;
    target: types.ILocalUser | types.IWebsocketRabbitTarget;
  } {
    // #TODO This might cause problems in the future, when server is overloaded and user sends chat message and api req
    const api = Object.keys(this.queue.api).find((e) => {
      return e === target;
    });
    if (api) {
      const res = { target: this.queue.api[api]!.user, type: enums.EConnectionType.Api };
      if (remove) delete this.queue.api[api];
      return res;
    }

    const socket = Object.keys(this.queue.socket).find((e) => {
      return e === target;
    })!;

    if (!socket) throw new errors.MissingMessageTargetError();

    const res = { target: this.queue.socket[socket]!.user, type: enums.EConnectionType.Socket };
    if (remove) delete this.queue.socket[socket];
    return res;
  }

  private setTokens(payload: types.IUserCredentials, target: types.ILocalUser): void {
    const { refreshToken, accessToken } = payload;
    target.cookie(enums.EJwt.AccessToken, accessToken, { httpOnly: true, maxAge: EJwtTime.TokenMaxAge * 1000 });
    target.set('Authorization', `Bearer ${accessToken}`);
    target.set('x-refresh-token', `${refreshToken}`);
    target.status(200).send();
  }

  private send(body: string, target: types.ILocalUser): void {
    target.send(body);
  }

  private sendError(err: errors.FullError, target: types.ILocalUser): void {
    const { message, code, name, status } = err;
    target.status(status).send(JSON.stringify({ message, code, name }));
  }
}
