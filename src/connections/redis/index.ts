import { createClient } from 'redis';
import Rooster from './rooster';
import { ERedisTargets } from '../../enums';
import getConfig from '../../tools/configLoader';
import Log from '../../tools/logger';
import type * as enums from '../../enums';
import type { IProfileEntity } from '../../structure/modules/profile/entity';
import type { IUserEntity } from '../../structure/modules/user/entity';
import type { ICachedUser, IFullError } from '../../types';
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

  async setExpirationDate(target: enums.ERedisTargets | string, ttl: number): Promise<void> {
    await this.rooster.setExpirationDate(target, ttl);
  }

  async removeOidcElement(target: string): Promise<void> {
    return this.rooster.removeElement(target);
  }

  async removeCachedUser(target: string): Promise<void> {
    return this.rooster.removeFromHash(`${ERedisTargets.CachedUser}:${target}`, target);
  }

  async addOidc(target: string, id: string, value: unknown): Promise<void> {
    await this.rooster.addToHash(target, id, JSON.stringify(value));
  }

  async addGrantId(target: string, id: string, value: string): Promise<void> {
    await this.rooster.addToHash(target, id, value);
  }

  async updateCachedUser(
    id: string,
    value: {
      profile?: Partial<IProfileEntity>;
      account?: Partial<IUserEntity>;
    },
  ): Promise<void> {
    const cachedUser = await this.rooster.getFromHash({ target: `${ERedisTargets.CachedUser}:${id}`, value: id });
    if (!cachedUser) return;
    const parsedUser = JSON.parse(cachedUser) as { account: IUserEntity; profile: IProfileEntity };
    await this.addCachedUser({
      ...parsedUser,
      account: value.account ? { ...parsedUser.account, ...value.account } : parsedUser.account,
      profile: value.profile ? { ...parsedUser.profile, ...value.profile } : parsedUser.profile,
    });
  }

  async getOidcHash(target: string, id: string): Promise<string | undefined> {
    return this.rooster.getFromHash({ target, value: id });
  }

  async addCachedUser(user: { account: IUserEntity; profile: IProfileEntity }): Promise<void> {
    await this.rooster.addToHash(
      `${ERedisTargets.CachedUser}:${user.account._id}`,
      user.account._id,
      JSON.stringify(user),
    );
    await this.rooster.setExpirationDate(`${ERedisTargets.CachedUser}:${user.account._id}`, 60000);
  }

  async getCachedUser(id: string): Promise<ICachedUser | undefined> {
    const cachedUser = await this.rooster.getFromHash({ target: `${ERedisTargets.CachedUser}:${id}`, value: id });
    return cachedUser ? (JSON.parse(cachedUser) as ICachedUser) : undefined;
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
