import type { RedisClientType } from 'redis';

export default class Rooster {
  private _client: RedisClientType | undefined = undefined;

  private get client(): RedisClientType {
    return this._client!;
  }

  init(client: RedisClientType): void {
    this._client = client;
  }

  async addToHash(target: string, key: string, value: string): Promise<void> {
    await this.client.hSet(target, key, value);
    await this.client.expire(`${target}:${value}`, 604800);
  }

  async getFromHash(target: string, value: string): Promise<string | undefined> {
    const exist = await this.checkElm(target);
    if (!exist) return undefined;
    return this.client.hGet(target, value);
  }

  async removeFromHash(target: string, value: string): Promise<void> {
    const exist = await this.checkElm(target);
    if (!exist) return;
    await this.client.hDel(target, value);
  }

  private async checkElm(target: string): Promise<boolean> {
    const e: number = await this.client.exists(target);
    return e !== 0;
  }
}
