import { beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import supertest from 'supertest';
import Utils from '../../utils/utils';
import fakeData from '../../fakeData.json';
import type { IProfileEntity } from '../../types';
import * as types from '../../types';
import { IUserEntity } from '../../types';
import { EMessageTypes, EUserTypes } from '../../../src/enums';
import State from '../../../src/tools/state';
import { FakeBroker } from '../../utils/mocks';
import * as errors from '../../../src/errors';

describe('Profiles = get', () => {
  const fakeBroker = State.broker as FakeBroker;
  const getProfile: types.IGetProfileDto = {
    id: '63e55edbe8a800060941121d',
  };
  const utils = new Utils();
  let accessToken;
  const fakeUser = fakeData.users[0] as IUserEntity;
  const { app } = State.router;

  beforeAll(async () => (accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User)));

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing id`, async () => {
        const target = new errors.MissingArgError('id') as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .get('/profile')
          .query({ id: undefined })
          .auth(accessToken, { type: 'bearer' })
          .send();
        const body = res.body as IFullError;

        expect(body.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect id`, async () => {
        const target = new errors.IncorrectArgTypeError('id should be objectId') as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .get('/profile')
          .query({ id: 'abc' })
          .auth(accessToken, { type: 'bearer' })
          .send();
        const body = res.body as IFullError;

        expect(body.message).toEqual(target.message);
      });
    });
  });

  describe('Should pass', () => {
    it(`Got profile`, async () => {
      fakeBroker.action = {
        shouldFail: false,
        returns: { payload: { _id: getProfile.id }, target: EMessageTypes.Send },
      };

      const res = await supertest(app)
        .get('/profile')
        .query({ id: getProfile.id })
        .auth(accessToken, { type: 'bearer' })
        .send();
      const body = res.body as IProfileEntity;

      expect(body._id).not.toBeUndefined();
    });
  });
});
