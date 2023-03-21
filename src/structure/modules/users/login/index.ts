import express from 'express';
import Validator from '../validation';
import State from '../../../../tools/state';
import * as enums from '../../../../enums';
import { EServices } from '../../../../enums';
import type * as types from './types';
import type { ILocalUser } from '../../../../types';
import { verify } from '../../../../tools/token';

export default class UserRouter {
  private readonly _router: express.Router;

  constructor() {
    this._router = express.Router();
  }

  get router(): express.Router {
    return this._router;
  }

  get(req: express.Request, res: ILocalUser): void {
    const token = req.cookies[enums.EJwt.AccessToken] as string | undefined;
    const { type } = verify(res, token);
    res.status(200).send({ type });
  }

  post(req: express.Request, res: ILocalUser): void {
    const data = req.body as types.ILoginReq;
    Validator.validateLogin(data);
    State.broker.sendLocally(enums.EUserMainTargets.User, enums.EUserTargets.Login, res, data, EServices.Users);
  }
}
