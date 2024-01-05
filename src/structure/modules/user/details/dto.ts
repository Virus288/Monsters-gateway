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
    if (!this.name && !this.id) throw new MissingArgError('id');
    if (!this.name) new Validation(this.id, 'id').isDefined();
    if (!this.id) new Validation(this.name, 'name').isDefined();
  }
}
