import * as errors from '../../../../errors';
import type { IDropItemDto } from './types';

export default class InventoryDropDto implements IDropItemDto {
  itemId: string;
  amount: number;

  constructor(body: IDropItemDto) {
    this.itemId = body.itemId;
    this.amount = body.amount;

    this.validate();
  }

  validate(): void {
    if (!this.itemId) throw new errors.MissingArgError('itemId');
    if (this.amount === undefined) throw new errors.MissingArgError('amount');
  }
}
