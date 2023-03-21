import * as errors from '../../../errors';
import type { IAddProfileReq, IGetProfileReq } from './types';

export default class Validation {
  static validateAddProfile(data: IAddProfileReq): void {
    if (!data || Object.keys(data).length === 0) throw new errors.NoDataProvided();
    if (!data?.race) throw new errors.NoDataProvided('race');
  }

  static validateGetProfile(data: IGetProfileReq): void {
    if (!data?.id) throw new errors.NoDataProvided('id');
  }
}
