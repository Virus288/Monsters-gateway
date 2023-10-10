import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import * as types from '../../types';
import LoginDto from '../../../src/structure/modules/user/login/dto';

describe('Login', () => {
  const login: types.ILoginDto = {
    login: 'Test',
    password: 'Test123',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(login).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(login);
          delete clone[k];
          const func = () => new LoginDto(clone);

          expect(func).toThrow(new errors.MissingArgError(k));
        });
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, () => {
      const func = () => new LoginDto(login);
      expect(func).not.toThrow();
    });
  });
});
