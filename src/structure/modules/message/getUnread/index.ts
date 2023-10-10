import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUnreadMessage } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async get(req: express.Request, res: ILocalUser): Promise<IUnreadMessage[]> {
    const data = new InventoryDropDto(Number(req.query.page));
    return (await res.locals.reqHandler.message.getUnread(data, res.locals)).payload;
  }
}
