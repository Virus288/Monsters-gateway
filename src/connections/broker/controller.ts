import * as enums from '../../enums';
import { InternalError } from '../../errors';
import Log from '../../tools/logger/log';
import { generateTempId } from '../../utils';
import type * as errors from '../../errors';
import type * as types from '../../types';
import type amqplib from 'amqplib';

export default class Communicator {
  private _queue: types.ICommunicationQueue = {};

  get queue(): types.ICommunicationQueue {
    return this._queue;
  }

  sendLocally<T extends types.IRabbitSubTargets>(
    target: types.IRabbitTargets,
    subTarget: T,
    resolve: (
      value:
        | { type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send; payload: unknown }
        | PromiseLike<{
            type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
            payload: unknown;
          }>,
    ) => void,
    reject: (reason?: unknown) => void,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
    service: enums.EServices,
    channel: amqplib.Channel,
    payload?: types.IRabbitConnectionData[T],
  ): void {
    const tempId = generateTempId();
    const body: types.IRabbitMessage = {
      user: {
        ...locals,
        tempId,
        validated: locals.validated ?? true,
      },
      payload,
      target,
      subTarget,
    };

    this.queue[locals.userId ?? tempId] = { resolve, reject, target: service };

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
      subTarget: enums.EMessagesTargets.Send,
      target: enums.EMessageTypes.Heartbeat,
    };

    switch (target) {
      case enums.EServices.Users:
        channel.sendToQueue(enums.EAmqQueues.Users, Buffer.from(JSON.stringify(body)), { persistent: true });
        return;
      case enums.EServices.Messages:
        channel.sendToQueue(enums.EAmqQueues.Messages, Buffer.from(JSON.stringify(body)), { persistent: true });
        return;
      default:
        throw new Error('Unknown message target');
    }
  };

  sendExternally(payload: types.IRabbitMessage): void {
    Log.log('Server', 'Got new message');
    Log.log('Server', JSON.stringify(payload));
    const target = this.findTarget(payload.user!.userId ?? payload.user!.tempId)!;
    if (!target) return undefined;

    switch (payload.target) {
      case enums.EMessageTypes.Error:
        return this.sendError(payload.payload as errors.FullError, target.reject);
      case enums.EMessageTypes.Credentials:
      case enums.EMessageTypes.Send:
        return this.send(payload.payload as string, payload.target, target.resolve);
      default:
        throw new Error('Unknown message target');
    }
  }

  fulfillDeadQueue(target: types.IAvailableServices): void {
    const { message, code, name, status } = new InternalError();

    Object.entries(this.queue).forEach((c) => {
      if (c[1].target === target) {
        c[1].reject({ message, code, name, status });
        delete this.queue[c[0]];
      }
    });
  }

  private findTarget(target: string):
    | {
        resolve: (
          value:
            | { type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send; payload: unknown }
            | PromiseLike<{
                type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
                payload: unknown;
              }>,
        ) => void;
        reject: (reason?: unknown) => void;
        target: enums.EServices;
      }
    | undefined {
    const data = this.queue[target];
    delete this.queue[target];
    return data;
  }

  private send(
    body: string,
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send,
    send: (
      value:
        | { type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send; payload: unknown }
        | PromiseLike<{
            type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
            payload: unknown;
          }>,
    ) => void,
  ): void {
    send({ type, payload: body });
  }

  private sendError(err: errors.FullError, send: (callback?: unknown) => void): void {
    send(err);
  }
}
