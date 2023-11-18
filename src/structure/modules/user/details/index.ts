import UserDetailsDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IUserEntity } from '../../../../../__tests__/types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async get(req: express.Request, res: ILocalUser): Promise<IUserEntity> {
    const data = new UserDetailsDto(req.query.name as string, req.query.id as string);
    return (await res.locals.reqHandler.user.getDetails(data, res.locals)).payload;
  }
}
