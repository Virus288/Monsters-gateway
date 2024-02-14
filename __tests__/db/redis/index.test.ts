import { describe, expect, it } from '@jest/globals';
import State from '../../../src/state';
import fakeData from '../../fakeData.json';
import { IUserEntity } from '../../../src/structure/modules/user/entity';
import { IProfileEntity } from '../../../src/structure/modules/profile/entity';
import { FakeRedis } from '../../utils/mocks';
import { ICachedUser } from '../../../src/types';

describe('Redis', () => {
  const fakeUser: IUserEntity = fakeData.users[0] as IUserEntity;
  const fakeProfile: IProfileEntity = fakeData.profiles[0] as IProfileEntity;

  describe('Should pass', () => {
    it(`No data in redis`, async () => {
      const user = await State.redis.getCachedUser(fakeUser._id);
      expect(user).toEqual(undefined);
    });

    it(`Name in redis`, async () => {
      await State.redis.addCachedUser({ account: fakeUser, profile: fakeProfile });
      const user = (await State.redis.getCachedUser(fakeUser._id)) as ICachedUser;
      expect(user.account).toEqual(fakeUser);

      await (State.redis as FakeRedis).removeCachedUser(fakeUser._id);
    });
  });
});
