import * as errors from '../../../errors';
import type ILoginUserDto from './login/dto';
import type IRegisterUserDto from './register/dto';

export default class Validation {
  static validateLogin(data: ILoginUserDto): void {
    const { password, login } = data;

    if (!password) throw new errors.NoDataProvidedError('password');
    if (!login) throw new errors.NoDataProvidedError('login');
  }

  static validateRegister(data: IRegisterUserDto): void {
    const { email } = data;
    this.validateLogin(data);

    if (!email) throw new errors.NoDataProvidedError('email');
  }
}
