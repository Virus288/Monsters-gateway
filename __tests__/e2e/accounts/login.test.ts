import { describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import supertest from 'supertest';
import fakeData from '../../fakeData.json';
import State from '../../../src/tools/state';
import * as types from '../../types';
import { IncorrectCredentialsError, MissingArgError, UsernameAlreadyInUseError } from '../../../src/errors';
import { FakeBroker } from '../../utils/mocks';
import { EMessageTypes } from '../../../src/enums';

describe('Login', () => {
  const fakeBroker = State.broker as FakeBroker;
  const loginData: types.ILoginDto = fakeData.users[0];
  const { app } = State.router;

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing login`, async () => {
        const target = new MissingArgError('login') as unknown as Record<string, unknown>;
        const clone = structuredClone(loginData);
        delete clone.login;

        const res = await supertest(app).post('/users/login').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual(target.message);
      });

      it(`Missing password`, async () => {
        const clone = structuredClone(loginData);
        delete clone.password;

        const res = await supertest(app).post('/users/login').send(clone);
        const body = res.body as IFullError;
        const target = new MissingArgError('password');

        expect(body.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect login`, async () => {
        const target = new IncorrectCredentialsError() as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData, login: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Incorrect credentials');
      });

      it(`Incorrect password`, async () => {
        const target = new IncorrectCredentialsError() as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData, password: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Incorrect credentials');
      });

      it(`Username already in use`, async () => {
        const target = new UsernameAlreadyInUseError() as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData });
        const body = res.body as IFullError;

        expect(body.message).toEqual(target.message);
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, async () => {
      fakeBroker.action = {
        shouldFail: false,
        returns: { payload: { accessToken: 'testToken', refreshToken: 'testToken' }, target: EMessageTypes.Send },
      };

      const res = await supertest(app).post('/users/login').send(loginData);
      const { authorization } = res.headers;

      expect(authorization).not.toBeUndefined();
      expect(res.headers['x-refresh-token']).not.toBeUndefined();
    });
  });
});
