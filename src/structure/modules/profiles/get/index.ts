import RouterFactory from '../../../../tools/abstracts/router';
import type express from 'express';
import type { ILocalUser } from '../../../../types';
import State from '../../../../tools/state';
import GetProfileDto from './dto';
import * as enums from '../../../../enums';

export default class GetProfileRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    const data = new GetProfileDto(req.query.id as string);

    State.broker.sendLocally(
      enums.EUserMainTargets.Profile,
      enums.EProfileTargets.Get,
      { target: enums.EConnectionType.Api, res },
      data,
      enums.EServices.Users,
    );
  }
}
