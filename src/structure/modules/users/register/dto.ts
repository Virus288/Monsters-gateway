import Validation from '../../../../tools/validation';
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
    new Validation(this.email, 'email').isDefined();
    new Validation(this.login, 'login').isDefined();
    new Validation(this.password, 'password').isDefined();
  }
}
