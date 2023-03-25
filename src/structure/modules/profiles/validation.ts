import * as errors from '../../../errors';
import type { IAddProfileDto, IGetProfileDto } from './dto';

export default class Validation {
  static validateAddProfile(data: IAddProfileDto): void {
    if (!data || Object.keys(data).length === 0) throw new errors.NoDataProvidedError();
    if (!data?.race) throw new errors.NoDataProvidedError('race');
  }

  static validateGetProfile(data: IGetProfileDto): void {
    if (!data) throw new errors.NoDataProvidedError('id');
    if (!data?.id) throw new errors.NoDataProvidedError('id');
  }
}
