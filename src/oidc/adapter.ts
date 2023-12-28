import Log from '../tools/logger/logger';
import type { Adapter as OidcAdapter, AdapterPayload } from 'oidc-provider';

export default class Adapter implements OidcAdapter {
  private readonly _name: string;
  private _interactions: Record<string, AdapterPayload> = {};
  private _authorizationCodes: Record<string, AdapterPayload> = {};

  constructor(name: string) {
    this._name = name;
  }

  private get interactions(): Record<string, AdapterPayload> {
    return this._interactions;
  }

  private get authorizationCodes(): Record<string, AdapterPayload> {
    return this._authorizationCodes;
  }

  private get name(): string {
    return this._name;
  }

  async upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<void> {
    Log.log('Upsert', id, JSON.stringify(payload), expiresIn, this.name);

    switch (this.name) {
      case 'AuthorizationCode':
        this.authorizationCodes[id] = payload;
        break;
      case 'Interaction':
        this.interactions[id] = payload;
        break;
      default:
        break;
    }

    return new Promise((resolve) => resolve(undefined));
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    Log.log('Find', id, this.name);
    switch (this.name) {
      case 'AuthorizationCode':
        return new Promise((resolve) => resolve(this.authorizationCodes[id]));
      case 'Interaction':
        return new Promise((resolve) => resolve(this.interactions[id]));
      default:
        return undefined;
    }
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    Log.log('Find by uid', uid, this.name);

    switch (this.name) {
      case 'AuthorizationCode':
        return new Promise((resolve) => {
          resolve(Object.values(this.authorizationCodes).find((e) => e.uid === uid));
        });
      case 'Interaction':
        return new Promise((resolve) => {
          resolve(Object.values(this.interactions).find((e) => e.uid === uid));
        });
      default:
        return undefined;
    }
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    Log.log('Find by user code', userCode, this.name);

    switch (this.name) {
      case 'AuthorizationCode':
        return new Promise((resolve) => resolve(this.authorizationCodes[userCode]));
      case 'Interaction':
        return new Promise((resolve) => resolve(this.interactions[userCode]));
      default:
        return undefined;
    }
  }

  async destroy(id: string): Promise<void> {
    Log.log('Destroy', id, this.name);

    switch (this.name) {
      case 'AuthorizationCode':
        delete this.authorizationCodes[id];
        break;
      case 'Interaction':
        delete this.interactions[id];
        break;
      default:
        break;
    }

    return new Promise((resolve) => resolve(undefined));
  }

  async revokeByGrantId(grantId: string): Promise<undefined> {
    Log.log('Revoke by grant', grantId, this.name);
    return new Promise((resolve) => resolve(undefined));
  }

  async consume(id: string): Promise<void> {
    Log.log('Consume', id, this.name);

    switch (this.name) {
      case 'AuthorizationCode':
        delete this.authorizationCodes[id];
        break;
      case 'Interaction':
        delete this.interactions[id];
        break;
      default:
        break;
    }

    return new Promise((resolve) => resolve(undefined));
  }
}
