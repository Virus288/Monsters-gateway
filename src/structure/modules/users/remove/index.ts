import RemoveUserDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

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
