import * as errors from '../../../errors';
import { IAddProfileReq, IGetProfileReq } from './types';

export default class Validation {
  static validateAddProfile(data: IAddProfileReq): void {
    if (!data?.race) throw new errors.NoDataProvided('race');
  }

  static validateGetProfile(data: IGetProfileReq): void {
    if (!data?.id) throw new errors.NoDataProvided('id');
  }
}
