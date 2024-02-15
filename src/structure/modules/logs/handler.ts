import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type AddLogDto from './add/dto';
import type { ILogEntity } from './entity';
import type GetLogsDto from './get/dto';
import type { EMessageTypes } from '../../../enums';
import type { IUserBrokerInfo } from '../../../types';

export default class Logs extends ReqHandler {
  async get(
    data: GetLogsDto,
    userData: IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: ILogEntity;
  }> {
    return (await this.sendReq(this.service, enums.EUserMainTargets.Log, enums.ELogTargets.GetLog, userData, data)) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: ILogEntity;
    };
  }

  async add(
    data: AddLogDto,
    userData: IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: { _id: string };
  }> {
    return (await this.sendReq(this.service, enums.EUserMainTargets.Log, enums.ELogTargets.AddLog, userData, data)) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: { _id: string };
    };
  }
}
