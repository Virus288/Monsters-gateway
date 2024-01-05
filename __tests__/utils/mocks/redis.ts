import Redis from '../../../src/connections/redis';

export default class FakeRedis extends Redis {
  private _removedUsers: { user: string; id: string }[] = [];

  constructor() {
    super();
  }

  get removedUsers(): { user: string; id: string }[] {
    return this._removedUsers;
  }

  set removedUsers(value: { user: string; id: string }[]) {
    this._removedUsers = value;
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
}
