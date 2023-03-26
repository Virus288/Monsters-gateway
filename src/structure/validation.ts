import type express from 'express';
import type ILoginDto from './modules/users/login/dto';
import type IRegisterDto from './modules/users/register/dto';
import type { IAddProfileDto, IGetProfileDto } from './modules/profiles/dto';
import UserValidator from './modules/users/validation';
import ProfileValidator from './modules/profiles/validation';

export default class Validation {
  validate(req: express.Request): void {
    const { method, path } = req;

    switch (path) {
      case 'users/login':
        switch (method) {
          case 'GET':
            return;
          case 'POST':
            return this.validateLogin(req.body as ILoginDto);
          default:
            return;
        }
      case '/users/register':
        return this.validateRegister(req.body as IRegisterDto);
      case '/profile/':
        switch (req.method) {
          case 'GET':
            return this.validateGetProfile(req.body as IGetProfileDto);
          case 'POST':
            return this.validateAddProfile(req.body as IAddProfileDto);
        }
    }
  }

  private validateLogin(data: ILoginDto): void {
    return UserValidator.validateLogin(data);
  }

  private validateRegister(data: IRegisterDto): void {
    return UserValidator.validateRegister(data);
  }

  private validateGetProfile(data: IGetProfileDto): void {
    return ProfileValidator.validateGet(data);
  }

  private validateAddProfile(data: IAddProfileDto): void {
    return ProfileValidator.validateAdd(data);
  }
}
