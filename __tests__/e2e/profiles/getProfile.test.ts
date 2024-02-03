import { beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import { IUserEntity } from '../../../src/types';
import supertest from 'supertest';
import fakeData from '../../fakeData.json';
import type { IProfileEntity } from '../../types';
import * as types from '../../types';
import * as enums from '../../../src/enums';
import State from '../../../src/state';
import { FakeBroker } from '../../utils/mocks';
import * as errors from '../../../src/errors';
import { getKeys } from '../../../src/oidc/utils';
import * as jose from 'node-jose';
import jwt from 'jsonwebtoken';

describe('Profiles = get', () => {
  const fakeBroker = State.broker as FakeBroker;
  const getProfile: types.IGetProfileDto = {
    id: '63e55edbe8a800060941121d',
  };
  let accessToken;
  const fakeUser = fakeData.users[0] as IUserEntity;
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
      it(`Missing id`, async () => {
        const target = new errors.MissingArgError('id') as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: enums.EMessageTypes.Send },
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
          returns: { payload: target, target: enums.EMessageTypes.Send },
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
        returns: { payload: { _id: getProfile.id }, target: enums.EMessageTypes.Send },
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
