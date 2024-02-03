import { beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import { IUserEntity } from '../../../src/types';
import supertest from 'supertest';
import * as enums from '../../../src/enums';
import fakeData from '../../fakeData.json';
import * as types from '../../types';
import State from '../../../src/state';
import { MissingArgError } from '../../../src/errors';
import { FakeBroker } from '../../utils/mocks';
import { getKeys } from '../../../src/oidc/utils';
import * as jose from 'node-jose';
import jwt from 'jsonwebtoken';

describe('Profiles - add', () => {
  const fakeBroker = State.broker as FakeBroker;
  const addProfile: types.IAddProfileDto = {
    race: enums.EUserRace.Elf,
  };
  let accessToken: string;
  let accessToken2: string;
  let accessToken3: string;
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const fakeUser3 = fakeData.users[2] as IUserEntity;
  const { app } = State.router;

  beforeAll(async () => {
    State.keys = await getKeys(1);
    const privateKey = (await jose.JWK.asKey(State.keys[0]!)).toPEM(true);

    const payload = {
      sub: fakeUser._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const payload2 = {
      sub: fakeUser2._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const payload3 = {
      sub: fakeUser3._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    accessToken2 = jwt.sign(payload2, privateKey, { algorithm: 'RS256' });
    accessToken3 = jwt.sign(payload3, privateKey, { algorithm: 'RS256' });
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing race`, async () => {
        const clone = structuredClone(addProfile);
        delete clone.race;

        const res = await supertest(app).post('/profile').auth(accessToken, { type: 'bearer' }).send(clone);
        const body = res.body as IFullError;
        const target = new MissingArgError('race');

        expect(body.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect race`, async () => {
        const target = new Error('race has incorrect type') as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: enums.EMessageTypes.Send },
        };

        const res = await supertest(app)
          .post('/profile')
          .auth(accessToken, { type: 'bearer' })
          .send({ ...addProfile, race: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('race has incorrect type');
      });

      it(`Profile already exists`, async () => {
        const target = new Error('Profile already initialized') as unknown as Record<string, unknown>;
        fakeBroker.action = {
          shouldFail: true,
          returns: { payload: target, target: enums.EMessageTypes.Send },
        };

        await supertest(app).post('/profile').auth(accessToken3, { type: 'bearer' }).send(addProfile);
        const res = await supertest(app).post('/profile').auth(accessToken3, { type: 'bearer' }).send(addProfile);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Profile already initialized');
      });
    });
  });

  describe('Should pass', () => {
    it(`Add profile`, async () => {
      const res = await supertest(app)
        .post('/profile')
        .auth(accessToken2, { type: 'bearer' })
        .send({ ...addProfile });

      expect(res.status).toEqual(200);
    });
  });
});
