import RouterFactory from '../../../../tools/abstracts/router';
import type { IUsersTokens } from '../../../../types';
import type { IProfileEntity } from '../entity';
import type express from 'express';

export default class GetProfileRouter extends RouterFactory {
  get(_req: express.Request, res: express.Response): IProfileEntity {
    const locals = res.locals as IUsersTokens;

    return locals.profile as IProfileEntity;
  }
}
