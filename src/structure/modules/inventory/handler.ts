import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type { IInventoryEntity } from './get/types';
import type { EMessageTypes } from '../../../enums';
import type { IUserBrokerInfo } from '../../../types';
import type InventoryDropDto from '../../modules/inventory/drop/dto';
import type InventoryUseDto from '../../modules/inventory/use/dto';

export default class Inventory extends ReqHandler {
  async use(data: InventoryUseDto, userData: IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Inventory, enums.EItemsTargets.Use, userData, data);
  }

  async drop(data: InventoryDropDto, userData: IUserBrokerInfo): Promise<void> {
    await this.sendReq(this.service, enums.EUserMainTargets.Inventory, enums.EItemsTargets.Drop, userData, data);
  }

  async get(userData: IUserBrokerInfo): Promise<{
    type: EMessageTypes.Credentials | EMessageTypes.Send;
    payload: IInventoryEntity;
  }> {
    return (await this.sendReq(
      this.service,
      enums.EUserMainTargets.Message,
      enums.EMessagesTargets.GetUnread,
      userData,
    )) as {
      type: EMessageTypes.Credentials | EMessageTypes.Send;
      payload: IInventoryEntity;
    };
  }
}
