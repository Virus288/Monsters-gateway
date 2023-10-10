import LoginDto from './dto';
import * as enums from '../../../../enums';
import { EJwt, EJwtTime } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import { verify } from '../../../../tools/token';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): { id: string; type: enums.EUserTypes } {
    let access: string | undefined = undefined;
    if (req.headers.authorization) {
      const key = req.headers.authorization;
      if (key.includes('Bearer')) access = req.headers.authorization.split('Bearer')[1]!.trim();
    } else {
      access = (req.cookies as { [EJwt.AccessToken]: string | undefined })[EJwt.AccessToken];
    }

    const { type, id } = verify(res, access);
    return { type, id };
  }

  async post(req: express.Request, res: ILocalUser): Promise<void> {
    const data = new LoginDto(req.body as LoginDto);
    const callback = await res.locals.reqHandler.user.login(data, res.locals);

    const { accessToken, refreshToken } = callback.payload;
    res.cookie(enums.EJwt.AccessToken, accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: EJwtTime.TokenMaxAge * 1000,
      sameSite: 'none',
    });
    res.set('Authorization', `Bearer ${accessToken}`);
    res.set('x-refresh-token', `${refreshToken}`);
    res.status(200).send();
  }
}
