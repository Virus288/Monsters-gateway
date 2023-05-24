import * as errors from '../../../../errors';
import type { ILoginDto } from './types';

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
