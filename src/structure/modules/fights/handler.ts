import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type AttackDto from './attack/dto';
import type CreateFightDto from './debug/dto';
import type { IActionEntity } from './entity';
import type { EMessageTypes } from '../../../enums';
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

  async attack(
    data: AttackDto,
    userInfo: types.IUserBrokerInfo,
  ): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IActionEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Fight,
      enums.EFightsTargets.Attack,
      userInfo,
      data,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IActionEntity;
    };
  }
}
