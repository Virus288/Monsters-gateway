import Redis from '../../../src/connections/redis';
import type { IUserEntity } from '../../../src/structure/modules/user/entity';
import type { IProfileEntity } from '../../../src/structure/modules/profile/entity';
import type { ICachedUser } from '../../../src/types';

export default class FakeRedis extends Redis {
  private _removedUsers: { user: string; id: string }[] = [];
  private _cachedUsers: ICachedUser[] = [];

  constructor() {
    super();
  }

  get removedUsers(): { user: string; id: string }[] {
    return this._removedUsers;
  }

  set removedUsers(value: { user: string; id: string }[]) {
    this._removedUsers = value;
  }

  get cachedUsers(): ICachedUser[] {
    return this._cachedUsers;
  }

  set cachedUsers(value: ICachedUser[]) {
    this._cachedUsers = value;
  }

  override async addRemovedUser(user: string, id: string): Promise<void> {
    this.removedUsers.push({ user, id });
    return;
  }

  override async getRemovedUsers(target: string): Promise<string | undefined> {
    const user = this.removedUsers.find((e) => e.id === target);
    return user ? user.user : user;
  }

  override async removeRemovedUser(target: string): Promise<void> {
    this.removedUsers = this.removedUsers.filter((e) => e.id !== target);
  }

  override async addCachedUser(user: { account: IUserEntity; profile: IProfileEntity }): Promise<void> {
    return new Promise((resolve) => {
      this.cachedUsers.push(user);
      resolve();
    });
  }

  override async getCachedUser(id: string): Promise<ICachedUser | undefined> {
    return new Promise((resolve) => {
      resolve(this.cachedUsers.find((u) => u.account?._id === id));
    });
  }
}
