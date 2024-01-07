import State from '../state';
import Logger from '../tools/logger/log';
import type { Adapter as OidcAdapter, AdapterPayload } from 'oidc-provider';

export default class Adapter implements OidcAdapter {
  private readonly _name: string;
  private readonly _prefix: string = 'oidc:';

  constructor(name: string) {
    this._name = name;
  }

  private get prefix(): string {
    return this._prefix;
  }

  private get name(): string {
    return this._name;
  }

  async upsert(id: string, payload: AdapterPayload, expiresIn?: number): Promise<void> {
    await State.redis.addOidc(this.key(id), id, payload);
    if (expiresIn && expiresIn > 0) await State.redis.setExpirationDate(this.key(id), expiresIn);
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    const data = await State.redis.getOidcHash(this.key(id), id);

    if (!data || Object.keys(data).length === 0) {
      return undefined;
    }
    return JSON.parse(data) as AdapterPayload;
  }

  async destroy(id: string): Promise<void> {
    await State.redis.removeOidcElement(this.key(id));
  }

  async findByUserCode(_userCode: string): Promise<AdapterPayload | undefined> {
    Logger.log('Find by user code', 'Not implemented');
    return new Promise((resolve) => resolve(undefined));
  }

  async findByUid(_uid: string): Promise<AdapterPayload | undefined> {
    Logger.log('Find by uid', 'Not implemented');
    return new Promise((resolve) => resolve(undefined));
  }

  async revokeByGrantId(_grantId: string): Promise<void> {
    Logger.log('Revoke by grant id', 'Not implemented'); // #TODO but revoking tokens does work. Instead of revoking grants, they are being destroyed
    return new Promise((resolve) => resolve());
  }

  async consume(id: string): Promise<void> {
    await State.redis.addOidc(this.key(id), '', Math.floor(Date.now() / 1000));
  }

  private key(id: string): string {
    return `${this.prefix}${this.name}:${id}`;
  }
}
