import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUnreadMessage } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<IUnreadMessage[]> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new InventoryDropDto(Number(req.query.page));
    return (await reqHandler.message.getUnread(data, locals)).payload;
  }
}
