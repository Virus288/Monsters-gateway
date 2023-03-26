import type express from 'express';
import type { ILocalUser } from '../../../../types';
import State from '../../../../tools/state';
import * as enums from '../../../../enums';
import type IRegisterDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';

export default class UserRouter extends RouterFactory {
  post(req: express.Request, res: ILocalUser): void {
    const data = req.body as IRegisterDto;
    State.broker.sendLocally(
      enums.EUserMainTargets.User,
      enums.EUserTargets.Register,
      res,
      data,
      enums.EServices.Users,
    );
  }
}
