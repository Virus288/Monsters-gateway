import Validation from '../../../../tools/validation';
import type { IGetMessagesDto } from './types';

export default class GetMessagesDto implements IGetMessagesDto {
  page: number;
  target: string | undefined;

  constructor(page: number, target?: string) {
    this.page = page;
    this.target = target;

    this.validate();
  }

  validate(): void {
    new Validation(this.page, 'page').isDefined();
    if (this.target) new Validation(this.target, 'target').isDefined();
  }
}
