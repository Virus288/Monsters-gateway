import type express from 'express';
import type { ILocalUser } from '../../../../types';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import UserDetailsDto from './dto';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    const data = new UserDetailsDto(req.query.name as string, req.query.id as string);

    State.broker.sendLocally(
      enums.EUserMainTargets.User,
      enums.EUserTargets.GetName,
      { target: EConnectionType.Api, res },
      data,
      EServices.Users,
    );
  }
}
