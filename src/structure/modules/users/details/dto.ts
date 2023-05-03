import * as errors from '../../../../errors';
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
    if (!this.name) {
      if (!this.id) throw new errors.MissingArgError('id');
    }
    if (!this.id) {
      if (!this.name) throw new errors.MissingArgError('name');
    }
  }
}
