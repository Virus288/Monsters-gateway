import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import * as types from '../../src/types';
import { IFullError } from '../../src/types';
import * as localTypes from '../types';
import supertest from 'supertest';
import fakeData from '../fakeData.json';
import Router from '../../src/router';
import { generateRandomName } from '../../src/utils';
import Utils from '../utils';

describe('Register', () => {
  const registerData: types.IRegisterReq = fakeData.users[2];
  let utils: Utils;
  const router = new Router();

  beforeAll(async () => {
    utils = new Utils();
    await utils.init();
    router.init();
  });

  afterAll(async () => {
    router.close();
    await utils.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing login`, async () => {
        const clone = structuredClone(registerData);
        delete clone.login;

        const res = await supertest(router.app).post('/system/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('login not provided');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing password`, async () => {
        const clone = structuredClone(registerData);
        delete clone.password;

        const res = await supertest(router.app).post('/system/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('password not provided');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing password2`, async () => {
        const clone = structuredClone(registerData);
        delete clone.password2;

        const res = await supertest(router.app).post('/system/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('password2 not provided');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing email`, async () => {
        const clone = structuredClone(registerData);
        delete clone.email;

        const res = await supertest(router.app).post('/system/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('email not provided');
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Selected username is already in use`, async () => {
        const res = await supertest(router.app).post('/system/users/register').send(fakeData.users[0]);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Selected username is already in use');
        expect(body.code).not.toBeUndefined();
      });

      it(`Register incorrect`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({ ...registerData, login: '!@#$%^&*&*()_+P{:"<?a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('login should only contain arabic letters, numbers and special characters');
        expect(body.code).not.toBeUndefined();
      });

      it(`Login too short`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({ ...registerData, login: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('login should be at least 3 characters');
        expect(body.code).not.toBeUndefined();
      });

      it(`Login too long`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({
            ...registerData,
            login:
              'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
          });
        const body = res.body as IFullError;

        expect(body.message).toEqual('login should be less than 30 characters');
        expect(body.code).not.toBeUndefined();
      });

      it(`Password incorrect`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({ ...registerData, password: 'a@$QEWASD+)}KO_PL{:">?' });
        const body = res.body as IFullError;

        expect(body.message).toEqual(
          'password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
        );
        expect(body.code).not.toBeUndefined();
      });

      it(`Password too short`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({ ...registerData, password: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('password should be at least 6 characters long');
        expect(body.code).not.toBeUndefined();
      });

      it(`Password too long`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({
            ...registerData,
            password:
              'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad',
          });
        const body = res.body as IFullError;

        expect(body.message).toEqual('password should be less than 200 characters');
        expect(body.code).not.toBeUndefined();
      });

      it(`Passwords do not match`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({ ...registerData, password2: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('passwords not the same');
        expect(body.code).not.toBeUndefined();
      });

      it(`Email incorrect`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/register')
          .send({ ...registerData, email: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('not valid email address');
        expect(body.code).not.toBeUndefined();
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated register`, async () => {
      const res = await supertest(router.app)
        .post('/system/users/register')
        .send({
          ...registerData,
          login: generateRandomName(),
          email: `${generateRandomName()}@${generateRandomName()}.test`,
        });
      const body = res.body as localTypes.ILoginSuccessResponse;

      expect(body).toEqual('');
    });
  });
});
