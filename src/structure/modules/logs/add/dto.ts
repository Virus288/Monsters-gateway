import Validation from '../../../../tools/validation';
import type { IAddLogDto } from './types';

export default class AddLogDto implements IAddLogDto {
  message: string;

  constructor(data: IAddLogDto) {
    this.message = data.message;

    this.validate();
  }

  validate(): void {
    new Validation(this.message, 'message').isDefined();
  }
}
