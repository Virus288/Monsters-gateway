import AttackDto from './dto';
import { ECharacterState, EFightStatus } from '../../../../enums';
import * as errors from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import ChangeCharacterStatusDto from '../../character/changeState/dto';
import UserDetailsDto from '../../user/details/dto';
import type { IAttackDto } from './types';
import type * as types from '../../../../types';
import type { IProfileEntity } from '../../profile/entity';
import type { IActionEntity } from '../entity';
import type express from 'express';

export default class FightRouter extends RouterFactory {
  async post(
    req: express.Request,
    res: express.Response,
  ): Promise<{
    data: { logs: IActionEntity[]; status: EFightStatus };
    state?: Partial<IProfileEntity>;
  }> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler } = locals;

    const body = req.body as IAttackDto;
    if (!body.target) throw new errors.MissingArgError('target');

    const users = await reqHandler.user.getDetails([new UserDetailsDto({ name: body.target })], {
      userId: locals.userId,
      tempId: locals.tempId,
    });

    if (users.payload.length === 0) {
      throw new errors.NoUserWithProvidedName([body.target]);
    }

    let { payload } = await reqHandler.fights.attack(new AttackDto({ target: users.payload[0]?._id as string }), {
      userId: locals.userId,
      tempId: locals.tempId,
    });

    payload = await this.prepareLogs(payload, locals);

    if (payload.status !== EFightStatus.Ongoing) {
      const characterState = new ChangeCharacterStatusDto({ state: ECharacterState.Map });
      const stateUpdate = await reqHandler.characterState.changeState(characterState, {
        userId: locals.userId,
        tempId: locals.tempId,
      });

      return { data: payload, state: stateUpdate };
    }

    return { data: payload };
  }

  private async prepareLogs(
    data: { logs: IActionEntity[]; status: EFightStatus },
    locals: types.IUsersTokens,
  ): Promise<{ logs: IActionEntity[]; status: EFightStatus }> {
    const { reqHandler } = locals;
    const ids: string[] = data.logs.map((l) => [l.character, l.target]).flat();

    const users = (
      await reqHandler.user.getDetails(
        ids.map((id) => new UserDetailsDto({ id })),
        {
          userId: locals.userId,
          tempId: locals.tempId,
        },
      )
    ).payload;

    // #TODO This code assumes that enemy will have existing profile ( will be another user ). This WILL NOT work for bots
    return {
      status: data.status,
      logs: data.logs.map((l) => {
        return {
          ...l,
          character: users.find((user) => user._id === l.character)?.login as string,
          target: users.find((user) => user._id === l.target)?.login as string,
        };
      }),
    };
  }
}
