import Validation from '../../../../tools/validation';
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
    new Validation(this.itemId, 'itemId').isDefined();
    new Validation(this.amount, 'amount').isDefined();
  }
}
