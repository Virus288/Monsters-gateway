import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/structure/modules/profiles/validation';
import * as errors from '../../../src/errors';
import { EUserRace } from '../../../src/enums';
import { IAddProfileReq } from '../../../src/structure/modules/profiles/types';

describe('Profile - add', () => {
  const addProfile: IAddProfileReq = {
    race: EUserRace.Elf,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing race`, () => {
        const clone = structuredClone(addProfile);
        delete clone.race;
        const func = () => Validation.validateAddProfile(clone);

        expect(func).toThrow(new errors.NoDataProvided());
      });
    });
  });

  describe('Should pass', () => {
    it(`Add profile`, () => {
      const func = () => Validation.validateAddProfile(addProfile);
      expect(func).not.toThrow();
    });
  });
});
