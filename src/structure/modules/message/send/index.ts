import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { ISendMessageDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async put(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new InventoryDropDto(req.body as ISendMessageDto, locals.userId!);
    await reqHandler.message.send(data, locals);
  }
}
