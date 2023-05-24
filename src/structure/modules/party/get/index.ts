import GetPartyDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class GetPartyRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    const data = new GetPartyDto(req.query.id as string);

    State.broker.sendLocally(
      enums.EUserMainTargets.Party,
      enums.EPartyTargets.Get,
      { target: EConnectionType.Api, res },
      data,
      EServices.Users,
    );
  }
}
