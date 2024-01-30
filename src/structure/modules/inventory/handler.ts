import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type { IInventoryEntity } from './get/types';
import type { EMessageTypes } from '../../../enums';
import type { IUsersTokens } from '../../../types';
import type InventoryDropDto from '../../modules/inventory/drop/dto';
import type InventoryUseDto from '../../modules/inventory/use/dto';

export default class Inventory extends ReqHandler {
  async use(data: InventoryUseDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Inventory, enums.EItemsTargets.Use, locals, data);
  }

  async drop(data: InventoryDropDto, locals: IUsersTokens): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Inventory, enums.EItemsTargets.Drop, locals, data);
  }

  async get(locals: IUsersTokens): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IInventoryEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Message,
      enums.EMessagesTargets.GetUnread,
      locals,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IInventoryEntity;
    };
  }
}
