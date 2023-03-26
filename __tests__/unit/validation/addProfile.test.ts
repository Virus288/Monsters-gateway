import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/structure/modules/profiles/validation';
import * as errors from '../../../src/errors';
import { EUserRace } from '../../../src/enums';
import * as types from '../../types';

describe('Profile - add', () => {
  const addProfile: types.IAddProfileDto = {
    race: EUserRace.Elf,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing race`, () => {
        const clone = structuredClone(addProfile);
        delete clone.race;
        const func = () => Validation.validateAdd(clone);

        expect(func).toThrow(new errors.NoDataProvidedError());
      });
    });
  });

  describe('Should pass', () => {
    it(`Add profile`, () => {
      const func = () => Validation.validateAdd(addProfile);
      expect(func).not.toThrow();
    });
  });
});
