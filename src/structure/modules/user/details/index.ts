import UserDetailsDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type * as types from '../../../../types';
import type { IUserEntity } from '../entity';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<IUserEntity> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler } = locals;

    const data = new UserDetailsDto({ name: req.query.name as string, id: req.query.id as string });
    return (
      await reqHandler.user.getDetails([data], {
        userId: locals.userId,
        tempId: locals.tempId,
      })
    ).payload[0]!;
  }
}
