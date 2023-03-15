import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../src/types';
import supertest from 'supertest';
import Router from '../../src/structure';
import Utils from '../utils';
import { EUserRace, EUserTypes } from '../../src/enums';
import fakeData from '../fakeData.json';
import { IAddProfileReq } from '../../src/structure/modules/profiles/types';

describe('Profiles - add', () => {
  const addProfile: IAddProfileReq = {
    race: EUserRace.Elf,
  };
  let utils: Utils;
  let accessToken;
  let accessToken2;
  const fakeUser = fakeData.users[0];
  const router = new Router();

  beforeAll(async () => {
    utils = new Utils();
    await utils.init();
    router.init();
    accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
    accessToken2 = utils.generateAccessToken('63e56c96de823fb83daba1c3', EUserTypes.User);
  });

  afterAll(async () => {
    router.close();
    await utils.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing race`, async () => {
        const clone = structuredClone(addProfile);
        delete clone.race;

        const res = await supertest(router.app)
          .post('/profile')
          .set('Cookie', [`accessToken=${accessToken}`])
          .send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('race not provided');
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect race`, async () => {
        const res = await supertest(router.app)
          .post('/profile')
          .set('Cookie', [`accessToken=${accessToken}`])
          .send({ ...addProfile, race: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Race has incorrect type');
        expect(body.code).not.toBeUndefined();
      });

      it(`Profile already exists`, async () => {
        const res = await supertest(router.app)
          .post('/profile')
          .set('Cookie', [`accessToken=${accessToken}`])
          .send(addProfile);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Profile already exists');
      });
    });
  });

  describe('Should pass', () => {
    it(`Add profile`, async () => {
      const res = await supertest(router.app)
        .post('/profile')
        .set('Cookie', [`accessToken=${accessToken2}`])
        .send({ ...addProfile });

      console.log(res.body);

      expect(res.status).toEqual(200);
    });
  });
});
