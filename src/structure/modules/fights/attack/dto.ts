import Validation from '../../../../tools/validation';
import type { IAttackDto } from './types';

export default class AttackDto implements IAttackDto {
  target: string;

  constructor(body: IAttackDto) {
    this.target = body.target;

    this.validate();
  }

  validate(): void {
    new Validation(this.target, 'attacker').isDefined();
  }
}
