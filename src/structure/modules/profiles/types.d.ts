import type { EUserRace } from '../../../enums';

export interface IGetProfileReq {
  id: string;
}

export interface IAddProfileReq {
  race: EUserRace;
}
