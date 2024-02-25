import Validation from '../../../../tools/validation';
import type { ICreateFightDto, IFightProfile } from './types';

export default class CreateFightDto implements ICreateFightDto {
  teams: [IFightProfile[], IFightProfile[]] = [[], []];
  attacker: string;

  constructor(body: ICreateFightDto) {
    this.teams = body.teams;
    this.attacker = body.attacker;

    this.validate();
  }

  validate(): void {
    new Validation(this.teams, 'teams').isArray().minElements(2).maxElements(2);
    new Validation(this.attacker, 'attacker').isDefined();

    this.teams.forEach((t) => {
      new Validation(t, 'team').isArray();
    });
  }
}
