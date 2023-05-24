import AddProfileDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class AddProfileRouter extends RouterFactory {
  post(req: express.Request, res: ILocalUser): void {
    const data = new AddProfileDto(req.body as AddProfileDto);

    State.broker.sendLocally(
      enums.EUserMainTargets.Profile,
      enums.EProfileTargets.Create,
      { target: EConnectionType.Api, res },
      { ...data, id: res.locals.userId },
      enums.EServices.Users,
    );
  }
}
