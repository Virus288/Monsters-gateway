import Validation from '../../../../tools/validation';
import type { IAddLogDto } from './types';

export default class AddLogDto implements IAddLogDto {
  message: string;
  target: string;

  constructor(data: IAddLogDto) {
    this.message = data.message;
    this.target = data.target;

    this.validate();
  }

  validate(): void {
    new Validation(this.message, 'message').isDefined();
    new Validation(this.target, 'target').isDefined();
  }
}
