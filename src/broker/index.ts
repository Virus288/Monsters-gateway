import * as enums from '../enums';
import { EConnectionType, ESocketType } from '../enums';
import type * as types from '../types';
import amqplib from 'amqplib';
import getConfig from '../tools/configLoader';
import type Communicator from './controller';
import Controller from './controller';
import type { FullError } from '../errors';
import { InternalError } from '../errors';
import Log from '../tools/logger/log';
import State from '../tools/state';

export default class Broker {
  private _retryTimeout: NodeJS.Timeout;
  private _connection: amqplib.Connection;
  private _connectionTries = 0;
  private _channel: amqplib.Channel;
  private _channelTries = 0;
  private _services: {
    [key in types.IAvailableServices]: { timeout: NodeJS.Timeout; retries: number; dead: boolean };
  } = {
    [enums.EServices.Users]: { timeout: null, retries: 0, dead: true },
    [enums.EServices.Messages]: { timeout: null, retries: 0, dead: true },
  };

  private _controller: Controller;

  private get controller(): Communicator {
    return this._controller;
  }

  init(): void {
    this._controller = new Controller();
    this.initCommunication();
  }

  sendLocally<T extends EConnectionType>(
    target: types.IRabbitTargets,
    subTarget: types.IRabbitSubTargets,
    res: { target: T; res: types.IConnectionType[T] },
    payload: unknown,
    service: enums.EServices,
  ): void {
    const queue = this._services[service as types.IAvailableServices];
    if (queue.dead) return this.sendError(res, new InternalError());
    this.controller.sendLocally(target, subTarget, res, payload, service, this._channel);
  }

  close(): void {
    if (this._retryTimeout) clearTimeout(this._retryTimeout);
    this.cleanAll();
    this._connection
      .close()
      .then(() => {
        if (this._retryTimeout) clearTimeout(this._retryTimeout);
        this.cleanAll();
      })
      .catch(() => undefined);
  }

  private reconnect(): void {
    this.close();
    this.initCommunication();
  }

  private initCommunication(): void {
    if (this._connectionTries++ > enums.ERabbit.RetryLimit) {
      Log.error('Rabbit', 'Gave up connecting to rabbit. Is rabbit dead?');
      return;
    }

    amqplib
      .connect(getConfig().amqpURI)
      .then((connection) => {
        Log.log('Rabbit', 'Connected to rabbit');
        this._connection = connection;
        connection.on('close', () => this.close());
        connection.on('error', () => this.reconnect());
        this.createChannels();
      })
      .catch((err) => {
        Log.warn('Rabbit', 'Error connecting to RabbitMQ, retrying in 1 second');
        Log.error('Rabbit', err);
        this._retryTimeout = setTimeout(() => this.initCommunication(), 1000);
      });
  }

  private createChannels(): void {
    if (this._channel) return;
    if (this._channelTries++ > enums.ERabbit.RetryLimit) {
      Log.error('Rabbit', 'Error creating rabbit connection channel, stopped retrying');
    }

    this._connection
      .createChannel()
      .then((channel) => {
        Log.log('Rabbit', 'Channel connected');
        this._channel = channel;
        channel.on('close', () => this.cleanAll());
        channel.on('error', () => this.reconnectChannel());
        return this.createQueue();
      })
      .catch((err) => {
        Log.error('Rabbit', err);
        Log.error(
          'Rabbit',
          `Error creating rabbit connection channel, retrying in 1 second: ${(err as types.IFullError).message}`,
        );
        this._retryTimeout = setTimeout(() => this.createChannels(), 1000);
      });
  }

  private async createQueue(): Promise<void> {
    await Promise.all(
      Object.values(enums.EAmqQueues).map(async (queue) => {
        await this._channel.assertQueue(queue, { durable: true });
      }),
    );

    await this._channel.consume(
      enums.EAmqQueues.Gateway,
      (message) => {
        if (!message) return Log.warn('Rabbit', 'Received empty message');
        const payload = JSON.parse(message.content.toString()) as types.IRabbitMessage;
        if (payload.target === enums.EMessageTypes.Heartbeat) {
          this.validateHeartbeat(payload.payload as types.IAvailableServices);
        } else {
          this.errorWrapper(() => this.controller.sendExternally(payload));
        }
      },
      { noAck: true },
    );
    this.validateConnections();
  }

  private validateHeartbeat(target: types.IAvailableServices): void {
    const service = this._services[target];
    clearTimeout(service.timeout);

    if (service.dead) {
      Log.log(target, 'Resurrected');
    }

    this._services[target] = {
      ...this._services[target],
      timeout: setTimeout(() => this.checkHeartbeat(target), 30000),
      dead: false,
      retries: 0,
    };
  }

  private validateConnections(): void {
    const services = Object.entries(this._services);
    services.forEach((service) => {
      if (service[1].dead) {
        Log.log('Rabbit', 'Reviving service');
        this.retryHeartbeat(service[0] as types.IAvailableServices);
      } else {
        service[1].timeout = setTimeout(() => this.checkHeartbeat(service[0] as types.IAvailableServices), 30000);
      }
    });
  }

  private retryHeartbeat(target: types.IAvailableServices): void {
    const service = this._services[target];
    service.dead = true;
    if (service.retries >= 10) {
      Log.error(target, `Is down!. Stopped retrying after ${service.retries} tries.`);
      this.closeDeadQueue(target).catch((err) => {
        Log.error('Rabbit', "Couldn't clear queue");
        Log.error('Rabbit', err);
      });
    } else {
      Log.warn(target, `Is down!. Trying to connect for ${service.retries + 1} time.`);
      this.controller.sendHeartbeat(this._channel, target);
      service.timeout = setTimeout(() => this.retryHeartbeat(target), 5000);
      service.retries++;
    }
  }

  private checkHeartbeat(target: types.IAvailableServices): void {
    this.controller.sendHeartbeat(this._channel, target);
    this._services[target].timeout = setTimeout(() => this.retryHeartbeat(target), 5000);
  }

  private closeDeadQueue = async (target: types.IAvailableServices): Promise<void> => {
    switch (target) {
      case enums.EServices.Users:
        await this._channel.purgeQueue(enums.EAmqQueues.Users);
        break;
      case enums.EServices.Messages:
        await this._channel.purgeQueue(enums.EAmqQueues.Messages);
        break;
    }
    return this.controller.fulfillDeadQueue(target);
  };

  private async closeChannel(): Promise<void> {
    if (this._retryTimeout) {
      clearTimeout(this._retryTimeout);
    }
    await Promise.all(
      Object.values(enums.EAmqQueues).map(async (queue) => {
        await this._channel.purgeQueue(queue);
        await this._channel.deleteQueue(queue);
      }),
    );

    await this._channel.close();
    this._channel = null;
    this._channelTries = 0;
  }

  private reconnectChannel(): void {
    Log.error('Rabbit', 'Got err. Reconnecting');
    this.closeChannel()
      .then(() => {
        this.createChannels();
      })
      .catch((err) => {
        Log.error('Rabbit', "Couldn't create channels");
        Log.error('Rabbit', err);
      });
  }

  private cleanAll(): void {
    this._channel = null;
    this._connectionTries = 0;
    this._channelTries = 0;
    clearTimeout(this._retryTimeout);
    Object.entries(this._services).forEach((s) => {
      clearTimeout(s[1].timeout);
      delete this._services[s[0]];
    });
  }

  private sendError<T extends EConnectionType>(
    user: {
      target: T;
      res: types.IConnectionType[T];
    },
    error: FullError,
  ): void {
    const { message, code, name, status } = error;
    const { target, res } = user;

    if (target === EConnectionType.Socket) {
      State.socket.sendToUser(res as string, { message, code, name, status }, ESocketType.Error);
    } else {
      1;
      const localUser = res as types.ILocalUser;
      localUser.status(status).send(JSON.stringify({ message, code, name }));
    }
  }

  private errorWrapper(func: () => void): void {
    try {
      func();
    } catch (err) {
      Log.error('Rabbit', err);
    }
  }
}
