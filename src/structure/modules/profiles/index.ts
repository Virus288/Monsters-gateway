import type express from 'express';
import type { ILocalUser } from '../../../types';
import State from '../../../tools/state';
import * as enums from '../../../enums';
import { EServices } from '../../../enums';
import type { IAddProfileDto, IGetProfileDto } from './dto';
import RouterFactory from '../../../tools/abstracts/router';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    const data: IGetProfileDto = {
      id: req.query.id as string,
    };
    State.broker.sendLocally(enums.EUserMainTargets.Profile, enums.EProfileTargets.Get, res, data, EServices.Users);
  }

  post(req: express.Request, res: ILocalUser): void {
    const data = req.body as IAddProfileDto;
    State.broker.sendLocally(
      enums.EUserMainTargets.Profile,
      enums.EProfileTargets.Create,
      res,
      { ...data, id: res.locals.userId },
      enums.EServices.Users,
    );
  }
}
