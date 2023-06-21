import Validation from '../../../../tools/validation';
import type { IGetPartyDto } from './types';

export default class GetPartyDto implements IGetPartyDto {
  id: string;

  constructor(id: string) {
    this.id = id;

    this.validate();
  }

  validate(): void {
    new Validation(this.id, 'id').isDefined();
  }
}
