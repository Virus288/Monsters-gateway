import * as errors from '../../../../errors';
import type { IGetPartyDto } from './types';

export default class GetPartyDto implements IGetPartyDto {
  id: string;

  constructor(id: string) {
    this.id = id;

    this.validate();
  }

  validate(): void {
    if (!this.id) throw new errors.MissingArgError('leader');
  }
}
