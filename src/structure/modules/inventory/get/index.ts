import RouterFactory from '../../../../tools/abstracts/router';
import type { IInventoryEntity } from './types';
import type { ILocalUser } from '../../../../types';

export default class InventoryGetDto extends RouterFactory {
  async get(res: ILocalUser): Promise<IInventoryEntity> {
    return (await res.locals.reqHandler.inventory.get(res.locals)).payload;
  }
}
