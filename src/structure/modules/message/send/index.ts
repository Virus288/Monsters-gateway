import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { ISendMessageDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async put(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new InventoryDropDto(req.body as ISendMessageDto, res.locals.userId!);
    await res.locals.reqHandler.message.send(data, res.locals);
  }
}
