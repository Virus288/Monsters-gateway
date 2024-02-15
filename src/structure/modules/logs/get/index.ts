import GetLogDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUsersTokens } from '../../../../types';
import type { ILogEntity } from '../entity';
import type express from 'express';

export default class GetLogsRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<ILogEntity> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    return (
      await reqHandler.log.get(new GetLogDto(req.query.lastId as string | undefined), {
        userId: locals.userId,
        tempId: locals.tempId,
      })
    ).payload;
  }
}
