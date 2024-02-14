import Redis from '../../../src/connections/redis';
import type { IUserEntity } from '../../../src/structure/modules/user/entity';
import type { IProfileEntity } from '../../../src/structure/modules/profile/entity';
import type { ICachedUser } from '../../../src/types';

export default class FakeRedis extends Redis {
  private _cachedUsers: ICachedUser[] = [];

  constructor() {
    super();
  }

  get cachedUsers(): ICachedUser[] {
    return this._cachedUsers;
  }

  set cachedUsers(value: ICachedUser[]) {
    this._cachedUsers = value;
  }

  override async addCachedUser(user: { account: IUserEntity; profile: IProfileEntity }): Promise<void> {
    return new Promise((resolve) => {
      this.cachedUsers.push(user);
      resolve();
    });
  }

  override async removeCachedUser(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.cachedUsers = this.cachedUsers.filter((u) => u.account?._id !== id);
      resolve();
    });
  }

  override async getCachedUser(id: string): Promise<ICachedUser | undefined> {
    return new Promise((resolve) => {
      resolve(this.cachedUsers.find((u) => u.account?._id === id));
    });
  }
}
