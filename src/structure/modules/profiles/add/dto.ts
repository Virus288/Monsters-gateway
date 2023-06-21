import Validation from '../../../../tools/validation';
import type { IAddProfileDto } from './types';
import type { EUserRace } from '../../../../enums';

export default class AddProfileDto implements IAddProfileDto {
  race: EUserRace;

  constructor(data: IAddProfileDto) {
    this.race = data.race;

    this.validate();
  }

  private validate(): void {
    new Validation(this.race, 'race').isDefined();
  }
}
