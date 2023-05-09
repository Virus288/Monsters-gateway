import type express from 'express';
import type { ILocalUser } from '../../../../types';
import State from '../../../../tools/state';
import * as enums from '../../../../enums';
import { EConnectionType } from '../../../../enums';
import RemoveUserDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';

export default class UserRouter extends RouterFactory {
  delete(req: express.Request, res: ILocalUser): void {
    const data = new RemoveUserDto(req.body as RemoveUserDto);

    State.broker.sendLocally(
      enums.EUserMainTargets.User,
      enums.ESharedTargets.RemoveUser,
      { target: EConnectionType.Api, res },
      data,
      enums.EServices.Users,
    );
  }
}
