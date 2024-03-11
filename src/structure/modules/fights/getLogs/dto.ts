import Validation from '../../../../tools/validation';
import type { IGetFightLogsDto } from './types';

export default class GetFightLogsDto implements IGetFightLogsDto {
  id: string;

  constructor(body: IGetFightLogsDto) {
    this.id = body.id;

    this.validate();
  }

  validate(): void {
    new Validation(this.id, 'id').isDefined();
  }
}
