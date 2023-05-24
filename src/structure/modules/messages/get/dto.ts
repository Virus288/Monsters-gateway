import * as errors from '../../../../errors';
import type { IGetMessagesDto } from './types';

export default class GetMessagesDto implements IGetMessagesDto {
  page: number;

  constructor(page: number) {
    this.page = page;

    this.validate();
  }

  validate(): void {
    if (!this.page) throw new errors.MissingArgError('page');
  }
}
