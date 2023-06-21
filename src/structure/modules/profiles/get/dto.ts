import Validation from '../../../../tools/validation';
import type { IGetProfileDto } from './types';

export default class GetProfileDto implements IGetProfileDto {
  id: string;

  constructor(id: string) {
    this.id = id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined();
  }
}
