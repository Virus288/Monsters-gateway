import type express from 'express';
import type { ILocalUser } from '../../../../types';
import { generateToken, verifyRefresh } from '../../../../tools/token';
import RouterFactory from '../../../../tools/abstracts/router';
import { IncorrectRefreshTokenError } from '../../../../errors';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    let refresh: string;
    if (req.headers['x-refresh-token']) refresh = req.headers['x-refresh-token'] as string;

    try {
      const { type } = verifyRefresh(res, refresh);
      const access = generateToken(res.locals.userId, type);

      res.set('Authorization', `Bearer ${access}`);
      res.status(200).send({ type });
    } catch (err) {
      throw new IncorrectRefreshTokenError();
    }
  }
}
