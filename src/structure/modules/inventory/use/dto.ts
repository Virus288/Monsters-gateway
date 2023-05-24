import * as errors from '../../../../errors';
import type { IUseItemDto } from './types';

export default class InventoryAddDto implements IUseItemDto {
  itemId: string;
  amount: number;

  constructor(data: IUseItemDto) {
    this.itemId = data.itemId;
    this.amount = data.amount;

    this.validate();
  }

  validate(): void {
    if (!this.itemId) throw new errors.MissingArgError('itemId');
    if (this.amount === undefined) throw new errors.MissingArgError('amount');
  }
}
