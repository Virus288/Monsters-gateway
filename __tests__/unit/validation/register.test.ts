import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/structure/modules/users/validation';
import * as errors from '../../../src/errors';
import * as types from '../../types';

describe('Register', () => {
  const register: types.IRegisterDto = {
    login: 'Test',
    password: 'Test123',
    email: 'test@test.test',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(register).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(register);
          delete clone[k];
          const func = () => Validation.validateRegister(clone);

          expect(func).toThrow(new errors.MissingArgError(k));
        });
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated registry`, () => {
      const func = () => Validation.validateRegister(register);
      expect(func).not.toThrow();
    });
  });
});
