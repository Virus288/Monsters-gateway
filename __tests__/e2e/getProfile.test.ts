import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { IFullError } from '../../src/types';
import * as localTypes from '../types';
import supertest from 'supertest';
import Router from '../../src/structure';
import Utils from '../utils';
import { EUserTypes } from '../../src/enums';
import fakeData from '../fakeData.json';
import { IGetProfileReq } from '../../src/structure/modules/profiles/types';

describe('Profiles = get', () => {
  const getProfile: IGetProfileReq = {
    id: '63e55edbe8a800060941121d',
  };
  let utils: Utils;
  let accessToken;
  const fakeUser = fakeData.users[0];
  const router = new Router();

  beforeAll(async () => {
    utils = new Utils();
    await utils.init();
    router.init();
    accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
  });

  afterAll(async () => {
    router.close();
    await utils.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing id`, async () => {
        const clone = structuredClone(getProfile);
        delete clone.id;

        const res = await supertest(router.app)
          .get('/profile')
          .set('Cookie', [`accessToken=${accessToken}`])
          .send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('id not provided');
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect id`, async () => {
        const res = await supertest(router.app)
          .get('/profile')
          .set('Cookie', [`accessToken=${accessToken}`])
          .send({ ...getProfile, id: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Provided user id is invalid');
        expect(body.code).not.toBeUndefined();
      });
    });
  });

  describe('Should pass', () => {
    it(`Got profile`, async () => {
      const res = await supertest(router.app)
        .get('/profile')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send(getProfile);
      const body = res.body as localTypes.IProfileLean;

      expect(body._id).not.toBeUndefined();
    });
  });
});
