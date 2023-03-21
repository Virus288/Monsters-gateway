import { describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import * as localTypes from '../../types';
import supertest from 'supertest';
import fakeData from '../../fakeData.json';
import { ILoginReq } from '../../../src/structure/modules/users/login/types';
import State from '../../../src/tools/state';

describe('Login', () => {
  const loginData: ILoginReq = fakeData.users[0];
  const { app } = State.router;

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing login`, async () => {
        const clone = structuredClone(loginData);
        delete clone.login;

        const res = await supertest(app).post('/users/login').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('login not provided');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing password`, async () => {
        const clone = structuredClone(loginData);
        delete clone.password;

        const res = await supertest(app).post('/users/login').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('password not provided');
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect login`, async () => {
        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData, login: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Incorrect login or password');
        expect(body.code).not.toBeUndefined();
      });

      it(`Incorrect password`, async () => {
        const res = await supertest(app)
          .post('/users/login')
          .send({ ...loginData, password: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Incorrect login or password');
        expect(body.code).not.toBeUndefined();
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, async () => {
      const res = await supertest(app).post('/users/login').send(loginData);
      const body = res.body as localTypes.ILoginSuccessResponse;

      expect(body.refreshToken).not.toBeUndefined();
      expect(body.eol).not.toBeLessThan(Date.now());
    });
  });
});
