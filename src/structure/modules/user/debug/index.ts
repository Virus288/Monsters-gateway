import DebugGetAllUsersDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type * as types from '../../../../types';
import type { IUserEntity } from '../entity';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<IUserEntity[]> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler } = locals;

    const data = new DebugGetAllUsersDto(parseInt(req.query.page as string));
    return (
      await reqHandler.user.debugGetAll(data, {
        userId: locals.userId,
        validated: locals.validated,
        tempId: locals.tempId,
      })
    ).payload;
  }
}
