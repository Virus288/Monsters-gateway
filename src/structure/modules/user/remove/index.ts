import RemoveUserDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async delete(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new RemoveUserDto(req.body as RemoveUserDto);
    await res.locals.reqHandler.user.delete(data, res.locals);
  }
}
