import * as errors from '../../../../errors';
import type { IGetProfileDto } from './types';

export default class GetProfileDto implements IGetProfileDto {
  id: string;

  constructor(id: string) {
    this.id = id;

    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new errors.MissingArgError('id');
    if (typeof this.id !== 'string') throw new errors.IncorrectArgError('Id is not string');
  }
}
