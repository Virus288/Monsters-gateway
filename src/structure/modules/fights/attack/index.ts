import AttackDto from './dto';
import * as errors from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import UserDetailsDto from '../../user/details/dto';
import type { IAttackDto } from './types';
import type * as types from '../../../../types';
import type { IActionEntity } from '../entity';
import type express from 'express';

export default class FightRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<IActionEntity> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler } = locals;

    const body = req.body as IAttackDto;
    if (!body.target) throw new errors.MissingArgError('target');

    const users = await reqHandler.user.getDetails([new UserDetailsDto({ name: body.target })], {
      userId: locals.userId,
      tempId: locals.tempId,
    });

    return (
      await reqHandler.fights.attack(new AttackDto({ target: users.payload[0]?._id as string }), {
        userId: locals.userId,
        tempId: locals.tempId,
      })
    ).payload;
  }
}
