import * as errors from '../../../../errors';
import type { IGetUnreadMessagesDto } from './types';

export default class GetUnreadMessagesDto implements IGetUnreadMessagesDto {
  page: number;

  constructor(page: number) {
    this.page = page;

    this.validate();
  }

  validate(): void {
    if (!this.page) throw new errors.MissingArgError('page');
  }
}
