import InventoryUseDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUseItemDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async post(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new InventoryUseDto(req.body as IUseItemDto);
    await res.locals.reqHandler.inventory.use(data, res.locals);
  }
}
