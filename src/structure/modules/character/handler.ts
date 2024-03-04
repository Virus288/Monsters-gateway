import * as enums from '../../../enums';
import State from '../../../state';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type ChangeCharacterStatusDto from './changeState/dto';
import type { IUserBrokerInfo } from '../../../types';
import type { IProfileEntity } from '../profile/entity';

export default class CharacterState extends ReqHandler {
  async changeState(data: ChangeCharacterStatusDto, userInfo: IUserBrokerInfo): Promise<Partial<IProfileEntity>> {
    await this.sendReq(
      this.service,
      enums.EUserMainTargets.CharacterState,
      enums.ECharacterStateTargets.ChangeState,
      userInfo,
      data,
    );
    await State.redis.updateCachedUser(userInfo.userId as string, { profile: data });

    return data;
  }
}
