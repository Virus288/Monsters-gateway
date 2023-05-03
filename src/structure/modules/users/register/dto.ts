import * as errors from '../../../../errors';
import type { IRegisterDto } from './types';

export default class RegisterDto implements IRegisterDto {
  email: string;
  login: string;
  password: string;

  constructor(data: IRegisterDto) {
    this.email = data.email;
    this.login = data.login;
    this.password = data.password;

    this.validate();
  }

  validate(): void {
    if (!this.password) throw new errors.MissingArgError('password');
    if (!this.login) throw new errors.MissingArgError('login');
    if (!this.email) throw new errors.MissingArgError('email');
  }
}
