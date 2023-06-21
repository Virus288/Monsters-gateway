import { beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import supertest from 'supertest';
import Utils from '../../utils/utils';
import { EUserRace, EUserTypes } from '../../../src/enums';
import fakeData from '../../fakeData.json';
import * as types from '../../types';
import { IUserEntity } from '../../types';
import State from '../../../src/tools/state';
import { MissingArgError } from '../../../src/errors';

describe('Profiles - add', () => {
  const addProfile: types.IAddProfileDto = {
    race: EUserRace.Elf,
  };
  const utils = new Utils();
  let accessToken;
  let accessToken2;
  let accessToken3;
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const fakeUser3 = fakeData.users[2] as IUserEntity;
  const { app } = State.router;

  beforeAll(async () => {
    accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
    accessToken2 = utils.generateAccessToken(fakeUser2._id, EUserTypes.User);
    accessToken3 = utils.generateAccessToken(fakeUser3._id, EUserTypes.User);
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
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect race`, async () => {
        const res = await supertest(app)
          .post('/profile')
          .auth(accessToken, { type: 'bearer' })
          .send({ ...addProfile, race: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('race has incorrect type');
        expect(body.code).not.toBeUndefined();
      });

      it(`Profile already exists`, async () => {
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
