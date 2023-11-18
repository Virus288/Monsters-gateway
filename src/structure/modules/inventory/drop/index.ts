import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IDropItemDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async delete(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new InventoryDropDto(req.body as IDropItemDto);
    await res.locals.reqHandler.inventory.drop(data, res.locals);
  }
}
