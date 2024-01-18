import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type { IProfileEntity } from './entity';
import type { EMessageTypes } from '../../../enums';
import type { IUsersTokens } from '../../../types';
import type AddProfileDto from '../../modules/profile/add/dto';
import type GetProfileDto from '../../modules/profile/get/dto';

export default class Profile extends ReqHandler {
  async get(
    data: GetProfileDto,
    locals: IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IProfileEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Profile,
      enums.EProfileTargets.Get,
      locals,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IProfileEntity;
    };
  }

  async add(data: AddProfileDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Profile, enums.EProfileTargets.Create, locals, data);
  }
}
