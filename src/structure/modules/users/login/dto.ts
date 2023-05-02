import type { ILoginDto } from './types';
import * as errors from '../../../../errors';

export default class LoginDto implements ILoginDto {
  login: string;
  password: string;

  constructor(data: ILoginDto) {
    this.login = data.login;
    this.password = data.password;

    this.validate();
  }

  private validate(): void {
    if (!this.password) throw new errors.MissingArgError('password');
    if (!this.login) throw new errors.MissingArgError('login');
  }
}
