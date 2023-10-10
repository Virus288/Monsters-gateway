import AddProfileDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IAddProfileDto } from './types';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class AddProfileRouter extends RouterFactory {
  async post(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new AddProfileDto(req.body as IAddProfileDto);
    await res.locals.reqHandler.profile.add(data, res.locals);
  }
}
