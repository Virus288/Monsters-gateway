import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IReadMessageDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async patch(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new InventoryDropDto(req.body as IReadMessageDto);
    await reqHandler.message.read(data, locals);
  }
}
