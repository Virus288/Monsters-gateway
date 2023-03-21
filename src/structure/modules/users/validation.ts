import * as errors from '../../../errors';
import { ILoginReq } from './login/types';
import { IRegisterReq } from './register/types';

export default class Validation {
  static validateLogin(data: ILoginReq): void {
    const { password, login } = data;

    if (!password) throw new errors.NoDataProvided('password');
    if (!login) throw new errors.NoDataProvided('login');
  }

  static validateRegister(data: IRegisterReq): void {
    const { password2, email } = data;
    this.validateLogin(data);

    if (!password2) throw new errors.NoDataProvided('password2');
    if (!email) throw new errors.NoDataProvided('email');
  }
}
