import State from '../state';
import Logger from '../tools/logger/logger';
import type { Adapter as OidcAdapter, AdapterPayload } from 'oidc-provider';

export default class Adapter implements OidcAdapter {
  private readonly _name: string;
  private readonly _prefix: string = 'oidc:';
  private readonly _toConsume: string[] = ['RefreshToken'];

  constructor(name: string) {
    this._name = name;
  }

  private get toConsume(): string[] {
    return this._toConsume;
  }

  private get prefix(): string {
    return this._prefix;
  }

  private get name(): string {
    return this._name;
  }

  // #TODO Finish upserting and destoy. Make sure that all elements properly save to redis
  async upsert(id: string, payload: AdapterPayload, expiresIn?: number): Promise<void> {
    Logger.log(id, { payload, expiresIn });
    return new Promise((resolve) => resolve());
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    const data = this.toConsume.includes(this.name)
      ? await State.redis.getOidcHash(this.key(id))
      : await State.redis.getOidcString(this.key(id));

    if (!data || Object.keys(data).length === 0) {
      return undefined;
    }

    if (typeof data === 'string') {
      return JSON.parse(data) as AdapterPayload;
    }

    const { payload, ...other } = data;
    return {
      ...other,
      ...JSON.parse(payload as string),
    } as AdapterPayload;
  }

  async destroy(id: string): Promise<void> {
    Logger.log(id);
    return new Promise((resolve) => resolve(undefined));
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    const id = await State.redis.getOidcString(this.userCode(userCode));
    return this.find(id as string);
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    const id = await State.redis.getOidcString(this.uidKey(uid));
    return this.find(id as string);
  }

  async revokeByGrantId(grantId: string): Promise<undefined> {
    const tokens = await State.redis.getOidcList(this.grant(grantId));
    await Promise.all(tokens.map(async (t) => State.redis.removeOidcElement(t)));
    await State.redis.removeOidcElement(this.grant(grantId));
  }

  async consume(id: string): Promise<void> {
    await State.redis.addOidc(this.key(id), '', Math.floor(Date.now() / 1000));
  }

  private grant(id: string): string {
    return `${this.prefix}grant:${id}`;
  }

  private userCode(user: string): string {
    return `${this.prefix}userCode:${user}`;
  }

  private uidKey(uid: string): string {
    return `${this.prefix}uid:${uid}`;
  }

  private key(id: string): string {
    return `${this.prefix}${this.name}:${id}`;
  }
}
