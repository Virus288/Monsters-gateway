import express from 'express';
import type * as types from './types';
import type { ILocalUser } from '../../../../types';
import Validator from '../validation';
import State from '../../../../tools/state';
import * as enums from '../../../../enums';

export default class UserRouter {
  private readonly _router: express.Router;

  constructor() {
    this._router = express.Router();
  }

  get router(): express.Router {
    return this._router;
  }

  post(req: express.Request, res: ILocalUser): void {
    const data = req.body as types.IRegisterReq;
    Validator.validateRegister(data);
    State.broker.sendLocally(
      enums.EUserMainTargets.User,
      enums.EUserTargets.Register,
      res,
      data,
      enums.EServices.Users,
    );
  }
}
