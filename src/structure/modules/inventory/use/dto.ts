import Validation from '../../../../tools/validation';
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
    new Validation(this.itemId, 'itemId').isDefined();
    new Validation(this.amount, 'amount').isDefined();
  }
}
