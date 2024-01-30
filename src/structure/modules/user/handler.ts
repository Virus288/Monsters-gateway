import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type { EMessageTypes } from '../../../enums';
import type * as types from '../../../types';
import type LoginDto from '../../modules/oidc/interaction/dto';
import type UserDetailsDto from '../../modules/user/details/dto';
import type RegisterDto from '../../modules/user/register/dto';
import type RemoveUserDto from '../../modules/user/remove/dto';

export default class User extends ReqHandler {
  async delete(data: RemoveUserDto, locals: types.IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Remove, locals, data);
  }

  async register(data: RegisterDto, locals: types.IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Register, locals, data);
  }

  async getDetails(
    data: UserDetailsDto[],
    locals: types.IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: types.IUserEntity[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.User,
      enums.EUserTargets.GetName,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: types.IUserEntity[];
    };
  }

  async login(
    data: LoginDto,
    locals: types.IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: types.IUserCredentials;
  }> {
    return (await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Login, locals, data)) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: types.IUserCredentials;
    };
  }
}
