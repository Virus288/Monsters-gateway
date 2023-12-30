import type { Adapter as OidcAdapter, AdapterPayload } from 'oidc-provider';

export default class Adapter implements OidcAdapter {
  private readonly _name: string;
  private _data: Record<string, Record<string, AdapterPayload>> = {};

  constructor(name: string) {
    this._name = name;
  }

  get data(): Record<string, Record<string, AdapterPayload>> {
    return this._data;
  }

  private get name(): string {
    return this._name;
  }

  async upsert(id: string, payload: AdapterPayload): Promise<void> {
    if (!this.data[this.name]) {
      this.data[this.name] = {};
    }
    this.data[this.name]![id] = payload;
    return new Promise((resolve) => resolve(undefined));
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    if (!this.data[this.name]) {
      this.data[this.name] = {};
    }

    const found = this.data[this.name]![id];
    if (!found) return undefined;
    return new Promise((resolve) => resolve(found));
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    if (!this.data[this.name]) {
      this.data[this.name] = {};
    }

    const found = Object.entries(this.data[this.name]!).find(([, v]) => v.userCode === userCode);
    if (!found) return undefined;
    return new Promise((resolve) => resolve(found[1]));
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    if (!this.data[this.name]) {
      this.data[this.name] = {};
    }

    const found = Object.entries(this.data[this.name]!).find(([, v]) => v.uid === uid);
    if (!found) return undefined;
    return new Promise((resolve) => resolve(found[1]));
  }

  async destroy(id: string): Promise<void> {
    if (this.data[this.name]) {
      delete this.data[this.name]![id];
    }
    return new Promise((resolve) => resolve(undefined));
  }

  async revokeByGrantId(grantId: string): Promise<undefined> {
    if (this.data[this.name]) {
      const found = Object.entries(this.data[this.name]!).find(([, v]) => v.grantId === grantId);
      if (found) {
        delete this.data[this.name]![found[0]];
      }
    }
    return new Promise((resolve) => resolve(undefined));
  }

  async consume(id: string): Promise<void> {
    if (this.data[this.name] && this.data[this.name]![id]) {
      this.data[this.name]![id]!.consumed = true;
    }
    return new Promise((resolve) => resolve(undefined));
  }
}
