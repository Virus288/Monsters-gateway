import { IncorrectRefreshTokenError } from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import { generateToken, verifyRefresh } from '../../../../tools/token';
import type { EUserTypes } from '../../../../enums';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): { access: string; type: EUserTypes } {
    let refresh: string | null = null;
    if (req.headers['x-refresh-token']) refresh = req.headers['x-refresh-token'] as string;

    try {
      const { type } = verifyRefresh(res, refresh);
      const access = generateToken(res.locals.userId, type);

      return { access, type };
    } catch (err) {
      throw new IncorrectRefreshTokenError();
    }
  }
}
