import Validation from '../../../../tools/validation';
import type { IGetUnreadMessagesDto } from './types';

export default class GetUnreadMessagesDto implements IGetUnreadMessagesDto {
  page: number;

  constructor(page: number) {
    this.page = page;

    this.validate();
  }

  validate(): void {
    new Validation(this.page, 'page').isDefined();
  }
}
