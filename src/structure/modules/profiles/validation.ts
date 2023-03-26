import * as errors from '../../../errors';
import type { IAddProfileDto, IGetProfileDto } from './dto';

export default class Validation {
  static validateAdd(data: IAddProfileDto): void {
    if (!data || Object.keys(data).length === 0) throw new errors.NoDataProvidedError();
    if (!data?.race) throw new errors.MissingArgError('race');
  }

  static validateGet(data: IGetProfileDto): void {
    if (!data) throw new errors.MissingArgError('id');
    if (!data?.id) throw new errors.MissingArgError('id');
  }
}
