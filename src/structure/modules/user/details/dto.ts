import Validation from '../../../../tools/validation';
import type { IUserDetailsDto } from './types';

export default class UserDetailsDto implements IUserDetailsDto {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;

    this.validate();
  }

  validate(): void {
    if (!this.name) new Validation(this.id, 'id').isDefined();
    if (!this.id) new Validation(this.name, 'name').isDefined();
  }
}
