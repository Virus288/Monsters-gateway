import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type { IProfileEntity } from './entity';
import type { EMessageTypes } from '../../../enums';
import type { IUserBrokerInfo } from '../../../types';
import type AddProfileDto from '../../modules/profile/add/dto';
import type GetProfileDto from '../../modules/profile/get/dto';

export default class Profile extends ReqHandler {
  async get(
    data: GetProfileDto,
    userData: IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IProfileEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Profile,
      enums.EProfileTargets.Get,
      userData,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IProfileEntity;
    };
  }

  async add(data: AddProfileDto, userData: IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Profile, enums.EProfileTargets.Create, userData, data);
  }
}
