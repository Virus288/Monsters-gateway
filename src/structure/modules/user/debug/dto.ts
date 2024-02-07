import Validation from '../../../../tools/validation';
import type { IDebugGetAllUsersDto } from './types';

export default class DebugGetAllUsersDto implements IDebugGetAllUsersDto {
  page: number;

  constructor(page: number) {
    this.page = page;

    this.validate();
  }

  validate(): void {
    new Validation(this.page, 'page').isDefined().isNumber();
  }
}
