import type express from 'express';
import State from '../../../../tools/state';
import * as enums from '../../../../enums';
import { EConnectionType, EServices } from '../../../../enums';
import type { ILocalUser } from '../../../../types';
import { verify } from '../../../../tools/token';
import LoginDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';

export default class UserRouter extends RouterFactory {
  get(req: express.Request, res: ILocalUser): void {
    let access: string | null = null;
    if (req.headers.authorization) {
      const key = req.headers.authorization;
      if (!key.includes('Bearer')) return;
      access = req.headers.authorization.split('Bearer')[1].trim();
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
