import { beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../../src/types';
import supertest from 'supertest';
import Utils from '../../utils/utils';
import { EUserRace, EUserTypes } from '../../../src/enums';
import fakeData from '../../fakeData.json';
import { IAddProfileReq } from '../../../src/structure/modules/profiles/types';
import State from '../../../src/tools/state';

describe('Profiles - add', () => {
  const addProfile: IAddProfileReq = {
    race: EUserRace.Elf,
  };
  const utils = new Utils();
  let accessToken;
  let accessToken2;
  const fakeUser = fakeData.users[0];
  const { app } = State.router;

  beforeAll(async () => {
    accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
    accessToken2 = utils.generateAccessToken('63e56c96de823fb83daba1c3', EUserTypes.User);
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing race`, async () => {
        const clone = structuredClone(addProfile);
        delete clone.race;

        const res = await supertest(app).post('/profile').auth(accessToken, { type: 'bearer' }).send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('No data provided');
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

        expect(body.message).toEqual('Race has incorrect type');
        expect(body.code).not.toBeUndefined();
      });

      it(`Profile already exists`, async () => {
        const res = await supertest(app).post('/profile').auth(accessToken, { type: 'bearer' }).send(addProfile);
        const body = res.body as IFullError;

        expect(body.message).toEqual('Profile already exists');
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
