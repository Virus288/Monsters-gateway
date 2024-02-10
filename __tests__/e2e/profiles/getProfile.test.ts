import { beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import supertest from 'supertest';
import fakeData from '../../fakeData.json';
import type { IProfileEntity } from '../../types';
import * as types from '../../types';
import * as enums from '../../../src/enums';
import { EUserTypes } from '../../../src/enums';
import State from '../../../src/state';
import { FakeBroker } from '../../utils/mocks';
import * as errors from '../../../src/errors';
import { getKeys } from '../../../src/oidc/utils';
import * as jose from 'node-jose';
import jwt from 'jsonwebtoken';
import { IUserEntity } from '../../../src/structure/modules/user/entity';

describe('Profiles = get', () => {
  const fakeBroker = State.broker as FakeBroker;
  const fakeUser = fakeData.users[0] as IUserEntity;
  const getProfile: types.IGetProfileDto = {
    name: fakeUser.login,
  };
  let accessToken;
  const { app } = State.router;

  beforeAll(async () => {
    State.keys = await getKeys(1);
    const privateKey = (await jose.JWK.asKey(State.keys[0]!)).toPEM(true);

    const payload = {
      sub: fakeUser._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing name`, async () => {
        const target = new errors.MissingArgError('name') as unknown as Record<string, unknown>;
        fakeBroker.actions.push({
          shouldFail: true,
          returns: { payload: target, target: enums.EMessageTypes.Send },
        });

        const res = await supertest(app)
          .get('/profile')
          .query({ name: undefined })
          .auth(accessToken, { type: 'bearer' })
          .send();
        const body = res.body as IFullError;

        expect(body.message).toEqual(target.message);
      });
    });
  });

  describe('Should pass', () => {
    it(`Got profile`, async () => {
      fakeBroker.actions.push({
        shouldFail: false,
        returns: {
          payload: [
            {
              _id: fakeUser._id,
              login: fakeUser.login,
              verified: false,
              type: EUserTypes.User,
            },
          ],
          target: enums.EMessageTypes.Send,
        },
      });
      fakeBroker.actions.push({
        shouldFail: false,
        returns: { payload: { _id: fakeUser._id }, target: enums.EMessageTypes.Send },
      });

      const res = await supertest(app)
        .get('/profile')
        .query({ name: getProfile.name })
        .auth(accessToken, { type: 'bearer' })
        .send();
      const body = res.body as { data: IProfileEntity };

      expect(body.data._id).not.toBeUndefined();
    });
  });
});
