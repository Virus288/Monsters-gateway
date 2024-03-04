import type { EServices } from '../../../enums';

export interface IHealth {
  alive: number;

  [key: EServices]: boolean;
}
