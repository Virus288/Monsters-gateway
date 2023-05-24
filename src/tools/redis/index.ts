import { createClient } from 'redis';
import { RedisMemoryServer } from 'redis-memory-server';
import Rooster from './rooster';
import * as enums from '../../enums';
import getConfig from '../configLoader';
import Log from '../logger/log';
import type { RedisClientType } from 'redis';
import * as process from 'process';

export default class Redis {
  private readonly _client: RedisClientType;
  private readonly _rooster: Rooster;

  constructor() {
    const url = process.env.NODE_ENV === 'test' ? getConfig().redisTestURI : getConfig().redisURI;
    this._client = createClient({
      url,
    });
    this._rooster = new Rooster(this._client);
  }

  private _memoryServer: RedisMemoryServer | null = null;

  private get memoryServer(): RedisMemoryServer | null {
    return this._memoryServer;
  }

  private get client(): RedisClientType {
    return this._client;
  }

  private get rooster(): Rooster {
    return this._rooster;
  }

  async init(): Promise<void> {
    this.listen();
    await this.client.connect();
  }

  close(): void {
    this.client.disconnect().catch((err) => {
      Log.error('Redis', err);
    });
    if (process.env.NODE_ENV === 'test') {
      this.memoryServer?.stop().catch((err) => {
        Log.error('Memory server', err);
      });
    }
  }

  startTestServer(): void {
    this._memoryServer = new RedisMemoryServer({
      instance: {
        port: 6378,
        ip: '127.0.0.1',
      },
      autoStart: true,
    });
  }

  async getRemovedUsers(target: string): Promise<string | undefined> {
    return this.rooster.getFromHash(enums.ERedisTargets.RemovedUsers, target);
  }

  async addRemovedUser(user: string, id: string): Promise<void> {
    await this.rooster.addToHash(enums.ERedisTargets.RemovedUsers, id, user);
  }

  private listen(): void {
    this.client.on('error', (err) => Log.error('Redis', err));
  }
}
