import { describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import * as types from '../../types';
import supertest from 'supertest';
import fakeData from '../../fakeData.json';
import State from '../../../src/tools/state';
import { UsernameAlreadyInUseError } from '../../../src/errors';
import { FakeBroker } from '../../utils/mocks';
import { EMessageTypes } from '../../../src/enums';
import { generateRandomName } from '../../../src/utils';

describe('Register', () => {
  const fakeBroker = State.broker as FakeBroker;
  const registerData: types.IRegisterDto = fakeData.users[2];
  const registerData2: types.IRegisterDto = fakeData.users[3];
  const { app } = State.router;

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing login`, async () => {
        const clone = structuredClone(registerData);
        delete clone.login;
        const res = await supertest(app).post('/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Missing param: login');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing password`, async () => {
        const clone = structuredClone(registerData);
        delete clone.password;

        const res = await supertest(app).post('/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Missing param: password');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing email`, async () => {
        const clone = structuredClone(registerData);
        delete clone.email;

        const res = await supertest(app).post('/users/register').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Missing param: email');
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Selected username is already in use`, async () => {
        const target = new UsernameAlreadyInUseError() as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app).post('/users/register').send(fakeData.users[0]);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Selected username is already in use');
      });

      it(`Register incorrect`, async () => {
        const target = new Error(
          'login should only contain arabic letters, numbers and special characters',
        ) as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, login: '!@#$%^&*&*()_+P{:"<?a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('login should only contain arabic letters, numbers and special characters');
      });

      it(`Login too short`, async () => {
        const target = new Error('login should be more than 3 and less than 30 characters') as unknown as Record<
          string,
          unknown
        >;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, login: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('login should be more than 3 and less than 30 characters');
      });

      it(`Login too long`, async () => {
        const target = new Error('login should be more than 3 and less than 30 characters') as unknown as Record<
          string,
          unknown
        >;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({
            ...registerData,
            login:
              'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
          });
        const body = res.body as IFullError;

        expect(body.message).toEqual('login should be more than 3 and less than 30 characters');
      });

      it(`Password incorrect`, async () => {
        const target = new Error(
          'password should contain at least 8 characters with: at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
        ) as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, password: 'a@$QEWASD+)}KO_PL{:">?' });
        const body = res.body as IFullError;

        expect(body.message).toEqual(
          'password should contain at least 8 characters with: at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
        );
      });

      it(`Password too short`, async () => {
        const target = new Error('password should be more than 6 and less than 200 characters') as unknown as Record<
          string,
          unknown
        >;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, password: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('password should be more than 6 and less than 200 characters');
      });

      it(`Password too long`, async () => {
        const target = new Error('password should be more than 6 and less than 200 characters') as unknown as Record<
          string,
          unknown
        >;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({
            ...registerData,
            password:
              'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad',
          });
        const body = res.body as IFullError;

        expect(body.message).toEqual('password should be more than 6 and less than 200 characters');
      });

      it(`Email incorrect`, async () => {
        const target = new Error('email invalid') as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/users/register')
          .send({ ...registerData, email: 'a' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('email invalid');
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated register`, async () => {
      fakeBroker.action = {
        shouldFail: false,
        returns: { payload: {}, target: EMessageTypes.Send },
      };

      const res = await supertest(app)
        .post('/users/register')
        .send({
          ...registerData2,
          login: generateRandomName(),
          email: `${generateRandomName()}@${generateRandomName()}.test`,
        });
      const body = res.body as types.ILoginSuccessResponse;

      expect(body).toEqual('');
    });
  });
});
