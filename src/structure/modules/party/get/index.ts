import GetPartyDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IPartyEntity } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class GetPartyRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<IPartyEntity> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new GetPartyDto(req.query.id as string);
    return (await reqHandler.party.get(data, locals)).payload;
  }
}
