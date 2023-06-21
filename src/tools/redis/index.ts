import { createClient } from 'redis';
import Mock from './mock';
import Rooster from './rooster';
import * as enums from '../../enums';
import getConfig from '../configLoader';
import Log from '../logger/log';
import type { IFullError } from '../../types';
import type { RedisClientType } from 'redis';
import * as process from 'process';

export default class Redis {
  private readonly _rooster: Rooster;
  private readonly _mock: Mock;

  constructor() {
    this._rooster = new Rooster();
    this._mock = new Mock();
  }

  private _client: RedisClientType | undefined;

  private get client(): RedisClientType | undefined {
    return this._client;
  }

  private get mock(): Mock {
    return this._mock;
  }

  private get rooster(): Rooster {
    return this._rooster;
  }

  async init(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      await this.mock.init();
      await this.initMockClient();
    } else {
      this.initClient();
    }

    this.rooster.init(this.client!);
    this.listen();
    await this.client!.connect();
  }

  async close(): Promise<void> {
    await this.client!.quit();
    if (process.env.NODE_ENV === 'test') await this.mock.close();
  }

  async addRemovedUser(user: string, id: string): Promise<void> {
    await this.rooster.addToHash(enums.ERedisTargets.RemovedUsers, id, user);
  }

  async getRemovedUsers(target: string): Promise<string | undefined> {
    return this.rooster.getFromHash(enums.ERedisTargets.RemovedUsers, target);
  }

  async removeRemovedUser(target: string): Promise<void> {
    return this.rooster.removeFromHash(enums.ERedisTargets.RemovedUsers, target);
  }

  private initClient(): void {
    this._client = createClient({
      url: getConfig().redisURI,
    });
  }

  private async initMockClient(): Promise<void> {
    this._client = createClient({
      url: await this.mock.getUrl(),
    });
  }

  private listen(): void {
    this.client!.on('error', (err) => {
      const error = err as IFullError;
      return Log.error('Redis', error.message, error.stack);
    });

    this.client!.on('ready', () => Log.log('Redis', 'Redis connected'));
    this.client!.on('end', () => Log.log('Redis', 'Redis disconnected'));
    this.client!.on('reconnecting', () => Log.error('Redis', 'Redis error. Reconnecting'));
  }
}
