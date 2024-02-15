import AddLogDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IAddLogDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class AddLogsRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<{ _id: string }> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    return (
      await reqHandler.log.add(new AddLogDto(req.body as IAddLogDto), {
        userId: locals.userId,
        tempId: locals.tempId,
      })
    ).payload;
  }
}
