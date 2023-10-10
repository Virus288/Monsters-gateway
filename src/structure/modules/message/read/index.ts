import InventoryDropDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IReadMessageDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async patch(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new InventoryDropDto(req.body as IReadMessageDto);
    await res.locals.reqHandler.message.read(data, res.locals);
  }
}
