import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type DebugGetAllUsersDto from './debug/dto';
import type { IUserEntity } from './entity';
import type { EMessageTypes } from '../../../enums';
import type * as types from '../../../types';
import type LoginDto from '../../modules/oidc/interaction/dto';
import type UserDetailsDto from '../../modules/user/details/dto';
import type RegisterDto from '../../modules/user/register/dto';
import type RemoveUserDto from '../../modules/user/remove/dto';

export default class User extends ReqHandler {
  async delete(data: RemoveUserDto, userInfo: types.IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Remove, userInfo, data);
  }

  async register(data: RegisterDto, userInfo: types.IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EUserTargets.Register, userInfo, data);
  }

  async debugGetAll(
    data: DebugGetAllUsersDto,
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUserEntity[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.User,
      enums.EUserTargets.DebugGetAll,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUserEntity[];
    };
  }

  async getDetails(
    data: UserDetailsDto[],
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IUserEntity[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.User,
      enums.EUserTargets.GetName,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IUserEntity[];
    };
  }

  async login(
    data: LoginDto,
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: types.IUserCredentials;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.User,
      enums.EUserTargets.Login,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: types.IUserCredentials;
    };
  }
}
