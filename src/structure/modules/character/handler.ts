import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type ChangeCharacterStatusDto from './changeState/dto';
import type { IUserBrokerInfo } from '../../../types';

export default class CharacterState extends ReqHandler {
  async changeState(data: ChangeCharacterStatusDto, userInfo: IUserBrokerInfo): Promise<void> {
    await this.sendReq(
      this.service,
      enums.EUserMainTargets.CharacterState,
      enums.ECharacterStateTargets.ChangeState,
      userInfo,
      data,
    );
  }
}
