import Validation from '../../../../tools/validation';
import type { IRemoveUserDto } from './types';

export default class RemoveUserDto implements IRemoveUserDto {
  name: string;

  constructor(data: IRemoveUserDto) {
    this.name = data.name;

    this.validate();
  }

  validate(): void {
    new Validation(this.name, 'name').isDefined();
  }
}
