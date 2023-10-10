import * as enums from '../../enums';
import { type EMessageTypes } from '../../enums';
import ReqHandler from '../../tools/abstracts/reqHandler';
import type { IUsersTokens } from '../../types';
import type GetPartyDto from '../modules/party/get/dto';
import type { IPartyEntity } from '../modules/party/get/types';

export default class Party extends ReqHandler {
  async get(
    data: GetPartyDto,
    locals: IUsersTokens,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IPartyEntity;
  }> {
    return (await this.sendReq(this.service, enums.EUserMainTargets.User, enums.EPartyTargets.Get, locals, data)) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IPartyEntity;
    };
  }
}
