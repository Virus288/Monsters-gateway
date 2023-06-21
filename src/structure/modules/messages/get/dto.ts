import Validation from '../../../../tools/validation';
import type { IGetMessagesDto } from './types';

export default class GetMessagesDto implements IGetMessagesDto {
  page: number;

  constructor(page: number) {
    this.page = page;

    this.validate();
  }

  validate(): void {
    new Validation(this.page, 'page').isDefined();
  }
}
