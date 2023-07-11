import InventoryDropDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { IDropItemDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  delete(req: express.Request, res: ILocalUser): void {
    const data = new InventoryDropDto(req.body as IDropItemDto);

    State.broker.sendLocally(
      enums.EUserMainTargets.Inventory,
      enums.EItemsTargets.Drop,
      { target: EConnectionType.Api, res },
      data,
      EServices.Users,
    );
  }
}