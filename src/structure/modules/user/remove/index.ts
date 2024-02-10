import RemoveUserDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async delete(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new RemoveUserDto(req.body as RemoveUserDto);
    await reqHandler.user.delete(data, { userId: locals.userId, tempId: locals.tempId });
  }
}
