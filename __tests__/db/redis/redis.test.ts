import { describe, expect, it } from '@jest/globals';
import State from '../../../src/tools/state';
import fakeData from '../../fakeData.json';
import { IUserEntity } from '../../types';

describe('Redis', () => {
  const fakeUser: IUserEntity = fakeData.users[0];

  describe('Should pass', () => {
    it(`No data in redis`, async () => {
      const user = await State.redis.getRemovedUsers('');
      expect(user).toEqual(null);
    });

    it(`Name in redis`, async () => {
      await State.redis.addRemovedUser(fakeUser.login, fakeUser._id);
      const user = await State.redis.getRemovedUsers(fakeUser._id);
      expect(user).toEqual(fakeUser.login);
    });
  });
});
