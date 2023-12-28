import InventoryUseDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUseItemDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new InventoryUseDto(req.body as IUseItemDto);
    await reqHandler.inventory.use(data, locals);
  }
}
