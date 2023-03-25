import * as errors from '../../../errors';
import type ILoginUserDto from './login/dto';
import type IRegisterUserDto from './register/dto';

export default class Validation {
  static validateLogin(data: ILoginUserDto): void {
    if (!data.password) throw new errors.MissingArgError('password');
    if (!data.login) throw new errors.MissingArgError('login');
  }

  static validateRegister(data: IRegisterUserDto): void {
    if (!data || Object.keys(data).length === 0) throw new errors.NoDataProvidedError();
    this.validateLogin(data);

    if (!data.email) throw new errors.MissingArgError('email');
  }
}
