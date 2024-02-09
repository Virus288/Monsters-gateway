import { describe, expect, it } from '@jest/globals';
import State from '../../../src/state';
import fakeData from '../../fakeData.json';
import { IUserEntity } from '../../../src/structure/modules/user/entity';

describe('Redis', () => {
  const fakeUser: IUserEntity = fakeData.users[0] as IUserEntity;

  describe('Should pass', () => {
    it(`No data in redis`, async () => {
      const user = await State.redis.getRemovedUsers('');
      expect(user).toEqual(undefined);
    });

    it(`Name in redis`, async () => {
      await State.redis.addRemovedUser(fakeUser.login, fakeUser._id);
      const user = await State.redis.getRemovedUsers(fakeUser._id);
      expect(user).toEqual(fakeUser.login);

      await State.redis.removeRemovedUser(fakeUser._id);
    });
  });
});
