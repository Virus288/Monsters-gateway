import RouterFactory from '../../../../tools/abstracts/router';
import type * as types from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async get(_req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler } = locals;

    await reqHandler.fights.leaveFight(null, {
      userId: locals.userId,
      tempId: locals.tempId,
    });
  }
}
