import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type AttackDto from './attack/dto';
import type CreateFightDto from './debug/dto';
import type { IActionEntity, IFight, IFightLogsEntity } from './entity';
import type { IGetFightDto } from './getFights/types';
import type { IGetFightLogsDto } from './getLogs/types';
import type { EFightStatus, EMessageTypes } from '../../../enums';
import type * as types from '../../../types';

export default class Fight extends ReqHandler {
  async createFight(
    data: CreateFightDto, // Temporary change
    userInfo: types.IUserBrokerInfo,
  ): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Fight, enums.EFightsTargets.CreateFight, userInfo, data);
  }

  async leaveFight(data: null, userInfo: types.IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Fight, enums.EFightsTargets.Leave, userInfo, data);
  }

  async getLogs(
    data: IGetFightLogsDto,
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IFightLogsEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Fight,
      enums.EFightsTargets.GetLogs,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IFightLogsEntity;
    };
  }

  async getFights(
    data: IGetFightDto,
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IFight[];
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Fight,
      enums.EFightsTargets.GetFights,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IFight[];
    };
  }

  async attack(
    data: AttackDto,
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: { logs: IActionEntity[]; status: EFightStatus };
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Fight,
      enums.EFightsTargets.Attack,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: { logs: IActionEntity[]; status: EFightStatus };
    };
  }
}
