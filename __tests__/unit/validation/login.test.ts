import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/structure/modules/users/validation';
import * as errors from '../../../src/errors';
import * as types from '../../types';

describe('Login', () => {
  const login: types.ILoginUserDto = {
    login: 'Test',
    password: 'Test123',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(login).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(login);
          delete clone[k];
          const func = () => Validation.validateLogin(clone);

          expect(func).toThrow(new errors.NoDataProvidedError(k));
        });
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, () => {
      const func = () => Validation.validateLogin(login);
      expect(func).not.toThrow();
    });
  });
});
