import * as enums from '../../enums';
import ReqHandler from '../../tools/abstracts/reqHandler';
import type { IUserEntity } from '../../../__tests__/types';
import type { EMessageTypes } from '../../enums';
import type { IUserCredentials, IUsersTokens } from '../../types';
import type UserDetailsDto from '../modules/user/details/dto';
import type LoginDto from '../modules/user/login/dto';
import type RegisterDto from '../modules/user/register/dto';
import type RemoveUserDto from '../modules/user/remove/dto';

export default class User extends ReqHandler {
  async delete(data: RemoveUserDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Remove, locals, data);
  }

  async login(
    data: LoginDto,
    locals: IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUserCredentials;
  }> {
    return (await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Login, locals, data)) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUserCredentials;
    };
  }

  async register(data: RegisterDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Register, locals, data);
  }

  async getDetails(
    data: UserDetailsDto,
    locals: IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUserEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.User,
      enums.EUserTargets.GetName,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUserEntity;
    };
  }
}
