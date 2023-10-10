import GetPartyDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IPartyEntity } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class GetPartyRouter extends RouterFactory {
  async get(req: express.Request, res: ILocalUser): Promise<IPartyEntity> {
    const data = new GetPartyDto(req.query.id as string);
    return (await res.locals.reqHandler.party.get(data, res.locals)).payload;
  }
}
