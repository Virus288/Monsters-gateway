import type { RedisClientType } from 'redis';

export default class Rooster {
  private readonly _client: RedisClientType;

  constructor(client: RedisClientType) {
    this._client = client;
  }

  private get client(): RedisClientType {
    return this._client;
  }

  async addToHash(target: string, key: string, value?: string): Promise<void> {
    await this.client.hSet(target, key, value ?? key);
    await this.client.expire(`${target}:${value ?? key}`, 604800);
  }

  async getFromHash(target: string, value: string): Promise<string | undefined> {
    return this.client.hGet(target, value);
  }
}
