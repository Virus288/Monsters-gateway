import InventoryDropDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import type { ISendMessageDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  put(req: express.Request, res: ILocalUser): void {
    const data = new InventoryDropDto(req.body as ISendMessageDto, res.locals.userId!);

    State.broker.sendLocally(
      enums.EUserMainTargets.Messages,
      enums.EMessageTargets.Send,
      { target: EConnectionType.Api, res },
      data,
      EServices.Users,
    );
  }
}
