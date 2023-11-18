import GetProfileDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { ILocalUser } from '../../../../types';
import type { IProfileEntity } from '../entity';
import type express from 'express';

export default class GetProfileRouter extends RouterFactory {
  async get(req: express.Request, res: ILocalUser): Promise<IProfileEntity> {
    const data = new GetProfileDto(req.query.id as string);
    return (await res.locals.reqHandler.profile.get(data, res.locals)).payload;
  }
}
