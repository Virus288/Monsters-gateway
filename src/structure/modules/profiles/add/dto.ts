import type { IAddProfileDto } from './types';
import type { EUserRace } from '../../../../enums';
import * as errors from '../../../../errors';

export default class AddProfileDto implements IAddProfileDto {
  race: EUserRace;

  constructor(data: IAddProfileDto) {
    this.race = data.race;

    this.validate();
  }

  private validate(): void {
    if (!this.race) throw new errors.MissingArgError('race');
  }
}
