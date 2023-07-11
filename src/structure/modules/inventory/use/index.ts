import InventoryUseDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { IUseItemDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  post(req: express.Request, res: ILocalUser): void {
    const data = new InventoryUseDto(req.body as IUseItemDto);

    State.broker.sendLocally(
      enums.EUserMainTargets.Inventory,
      enums.EItemsTargets.Use,
      { target: EConnectionType.Api, res },
      data,
      EServices.Users,
    );
  }
}