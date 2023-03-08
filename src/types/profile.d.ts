import { EUserRace } from '../enums';

export interface INewProfileReq {
  race: EUserRace;
}

export interface IGetProfileReq {
  id: string;
}
