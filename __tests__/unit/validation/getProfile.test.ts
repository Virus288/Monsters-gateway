import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import * as types from '../../types';
import GetProfileDto from '../../../src/structure/modules/profiles/get/dto';

describe('Profile - get', () => {
  const getProfile: types.IGetProfileDto = {
    id: '63e55edbe8a800060941121d',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing id`, () => {
        const clone = structuredClone(getProfile);
        delete clone.id;
        const func = () => new GetProfileDto(clone.id);

        expect(func).toThrow(new errors.MissingArgError('id'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated req`, () => {
      const func = () => new GetProfileDto(getProfile.id);
      expect(func).not.toThrow();
    });
  });
});
