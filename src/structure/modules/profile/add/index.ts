import AddProfileDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IAddProfileDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class AddProfileRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new AddProfileDto(req.body as IAddProfileDto);
    await reqHandler.profile.add(data, { userId: locals.userId, tempId: locals.tempId });
  }
}
