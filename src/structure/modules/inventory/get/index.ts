import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { ILocalUser } from '../../../../types';

export default class InventoryRouter extends RouterFactory {
  get(res: ILocalUser): void {
    State.broker.sendLocally(
      enums.EUserMainTargets.Inventory,
      enums.EItemsTargets.Get,
      { target: EConnectionType.Api, res },
      undefined,
      EServices.Users,
    );
  }
}
