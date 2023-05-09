import * as errors from '../../../../errors';
import type { IRemoveUserDto } from './types';

export default class RemoveUserDto implements IRemoveUserDto {
  name: string;

  constructor(data: IRemoveUserDto) {
    this.name = data.name;

    this.validate();
  }

  validate(): void {
    if (!this.name) throw new errors.MissingArgError('name');
  }
}
