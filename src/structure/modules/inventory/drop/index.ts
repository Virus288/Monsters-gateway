import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IDropItemDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async delete(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new InventoryDropDto(req.body as IDropItemDto);
    await reqHandler.inventory.drop(data, locals);
  }
}
