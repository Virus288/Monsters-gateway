import { MissingArgError } from '../../../../errors';
import Validation from '../../../../tools/validation';
import type { IUserDetailsDto } from './types';

export default class UserDetailsDto implements IUserDetailsDto {
  name?: string;
  id?: string;

  constructor(data: { name?: string; id?: string }) {
    this.name = data.name;
    this.id = data.id;

    this.validate();
  }

  validate(): void {
    if (!this.name && !this.id) throw new MissingArgError('name');

    if (!this.name) {
      new Validation(this.id, 'id').isDefined();
    } else {
      new Validation(this.name, 'name').isDefined();
    }
  }
}
