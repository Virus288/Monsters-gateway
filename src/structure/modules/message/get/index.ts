import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IFullMessageEntity, IPreparedMessagesBody } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async get(
    req: express.Request,
    res: ILocalUser,
  ): Promise<Record<string, IPreparedMessagesBody> | IFullMessageEntity[]> {
    const data = new InventoryDropDto(Number(req.query.page));
    return (await res.locals.reqHandler.message.get(data, res.locals)).payload;
  }
}
