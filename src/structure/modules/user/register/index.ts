import RegisterDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async post(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new RegisterDto(req.body as RegisterDto);
    await res.locals.reqHandler.user.register(data, res.locals);
  }
}
