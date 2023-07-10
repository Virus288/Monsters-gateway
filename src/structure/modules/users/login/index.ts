import LoginDto from './dto';
import * as enums from '../../../../enums';
import { EConnectionType, EJwt, EServices } from '../../../../enums';
import RouterFactory from '../../../../tools/abstracts/router';
import State from '../../../../tools/state';
import { verify } from '../../../../tools/token';
import type { ILocalUser } from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    let access: string | undefined = undefined;
    if (req.headers.authorization) {
      const key = req.headers.authorization;
      if (!key.includes('Bearer')) return;
      access = req.headers.authorization.split('Bearer')[1]!.trim();
    } else {
      access = (req.cookies as { [EJwt.AccessToken]: string | undefined })[EJwt.AccessToken];
    }

    const { type } = verify(res, access);
    res.status(200).send({ type });
  }

  post(req: express.Request, res: ILocalUser): void {
    const data = new LoginDto(req.body as LoginDto);

    State.broker.sendLocally(
      enums.EUserMainTargets.User,
      enums.EUserTargets.Login,
      {
        target: EConnectionType.Api,
        res,
      },
      data,
      EServices.Users,
    );
  }
}
