import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/structure/modules/profiles/validation';
import * as errors from '../../../src/errors';
import * as types from '../../types';

describe('Profile - get', () => {
  const getProfile: types.IGetProfileDto = {
    id: '63e55edbe8a800060941121d',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing id`, () => {
        const clone = structuredClone(getProfile);
        delete clone.id;
        const func = () => Validation.validateGetProfile(clone);

        expect(func).toThrow(new errors.NoDataProvidedError('id'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated req`, () => {
      const func = () => Validation.validateGetProfile(getProfile);
      expect(func).not.toThrow();
    });
  });
});
