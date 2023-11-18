import { beforeAll, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import State from '../../../src/tools/state';
import { EMessageTypes, EUserTypes } from '../../../src/enums';
import Utils from '../../utils/utils';
import fakeData from '../../fakeData.json';
import { IFullError } from '../../../src/types';
import { IncorrectRefreshTokenError, UnauthorizedError } from '../../../src/errors';
import { IUserEntity } from '../../types';
import { FakeBroker } from '../../utils/mocks';

describe('Refresh', () => {
  const fakeBroker = State.broker as FakeBroker;
  const fakeUser = fakeData.users[0] as IUserEntity;
  const utils = new Utils();
  let accessToken: string;
  let refreshToken: string;
  const { app } = State.router;

  beforeAll(async () => {
    refreshToken = utils.generateRefreshToken(fakeUser._id, EUserTypes.User);
    accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`User not logged in`, async () => {
        const target = new UnauthorizedError() as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app).get('/users/refresh').send();
        const body = res.body as IFullError;

        expect(body.message).toEqual(new UnauthorizedError().message);
      });
    });

    describe('Incorrect data', () => {
      it(`Access token exist, but refresh token does not`, async () => {
        const target = new IncorrectRefreshTokenError() as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app).get('/users/refresh').auth(accessToken, { type: 'bearer' }).send();
        const body = res.body as IFullError;

        expect(body.message).toEqual(new IncorrectRefreshTokenError().message);
      });
    });
  });

  describe('Should pass', () => {
    it(`Token refreshed`, async () => {
      fakeBroker.action = {
        shouldFail: false,
        returns: { payload: { accessToken: 'testToken', refreshToken: 'testToken' }, target: EMessageTypes.Send },
      };

      const res = await supertest(app)
        .get('/users/refresh')
        .auth(accessToken, { type: 'bearer' })
        .set({ 'x-refresh-token': refreshToken })
        .send();
      const { authorization } = res.headers;

      expect(authorization).not.toBeUndefined();
    });
  });
});
