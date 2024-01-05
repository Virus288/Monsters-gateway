import { createClient } from 'redis';
import Rooster from './rooster';
import * as enums from '../../enums';
import getConfig from '../../tools/configLoader';
import Log from '../../tools/logger/log';
import type { IFullError } from '../../types';
import type { AdapterPayload } from 'oidc-provider';
import type { RedisClientType } from 'redis';

export default class Redis {
  private readonly _rooster: Rooster;
  private _client: RedisClientType | undefined;

  constructor() {
    this._rooster = new Rooster();
  }

  private get client(): RedisClientType | undefined {
    return this._client;
  }

  private get rooster(): Rooster {
    return this._rooster;
  }

  async init(): Promise<void> {
    this.initClient();
    this.rooster.init(this.client!);
    this.listen();
    await this.client!.connect();
  }

  async close(): Promise<void> {
    await this.client!.quit();
  }

  async addRemovedUser(user: string, id: string): Promise<void> {
    await this.rooster.addToHash(enums.ERedisTargets.RemovedUsers, id, user);
    await this.rooster.setExpirationDate(enums.ERedisTargets.RemovedUsers, id, 604800);
  }

  async getRemovedUsers(target: string): Promise<string | undefined> {
    return this.rooster.getFromHash(enums.ERedisTargets.RemovedUsers, target);
  }

  async removeRemovedUser(target: string): Promise<void> {
    return this.rooster.removeFromHash(enums.ERedisTargets.RemovedUsers, target);
  }

  async removeOidcElement(target: string): Promise<void> {
    return this.rooster.removeElement(target);
  }

  async addOidc(target: string, id: string, value: unknown): Promise<void> {
    await this.rooster.addToHash(target, id, JSON.stringify(value));
  }

  async getOidcHash(target: string): Promise<string | Record<string, string> | null> {
    return this.rooster.getAllFromHash(target);
  }

  async getOidcList(target: string): Promise<string[]> {
    return this.rooster.getFromList(target, 0, -1);
  }

  async getOidcString(target: string): Promise<string | null> {
    return this.rooster.get(target);
  }

  async getOidcByUserCode(target: string, id: string): Promise<AdapterPayload | undefined> {
    const found = Object.entries(this.data[this.name]!).find(([, v]) => v.userCode === userCode);
    if (!found) return undefined;
    return new Promise((resolve) => resolve(found[1]));
  }

  private initClient(): void {
    this._client = createClient({
      url: getConfig().redisURI,
    });
  }

  private listen(): void {
    this.client!.on('error', (err) => {
      const error = err as IFullError;
      return Log.error('Redis', error.message, error.stack);
    });

    this.client!.on('ready', () => Log.log('Redis', 'Redis connected'));
    this.client!.on('end', () => Log.log('Redis', 'Redis disconnected'));
    this.client!.on('reconnecting', () => Log.log('Redis', 'Redis error. Reconnecting'));
  }
}
