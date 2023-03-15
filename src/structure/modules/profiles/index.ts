import express from 'express';
import Validator from './validation';
import { IAddProfileReq, IGetProfileReq } from './types';
import { ILocalUser } from '../../../types';
import State from '../../../tools/state';
import * as enums from '../../../enums';
import { EServices } from '../../../enums';

export default class UserRouter {
  private readonly _router: express.Router;

  constructor() {
    this._router = express.Router();
  }

  get router(): express.Router {
    return this._router;
  }

  get(req: express.Request, res: ILocalUser): void {
    const data = req.body as IGetProfileReq;

    Validator.validateGetProfile(data);
    State.broker.sendLocally(enums.EUserMainTargets.Profile, enums.EProfileTargets.Get, res, data, EServices.Users);
  }

  post(req: express.Request, res: ILocalUser): void {
    const data = req.body as IAddProfileReq;
    Validator.validateAddProfile(data);
    State.broker.sendLocally(
      enums.EUserMainTargets.Profile,
      enums.EProfileTargets.Create,
      res,
      data,
      enums.EServices.Users,
    );
  }
}
