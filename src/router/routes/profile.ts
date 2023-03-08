import { Router } from 'express';
import type * as types from '../../types';
import State from '../../tools/state';
import { FullError } from '../../errors';
import * as enums from '../../enums';
import { EServices } from '../../enums';
import Validator from '../../validation';

const router = Router();

router.get('/', (req, res: types.ILocalUser) => {
  try {
    const data = req.body as types.IGetProfileReq;
    Validator.validateGetProfile(data);
    State.broker.sendLocally(enums.EUserMainTargets.Profile, enums.EProfileTargets.Get, res, data, EServices.Users);
  } catch (err) {
    const { message, code, name, status } = err as FullError;
    res.status(status).json({ message, code, name });
  }
});

router.post('/', (req, res: types.ILocalUser) => {
  try {
    const data = req.body as types.INewProfileReq;
    Validator.validateAddProfile(data);
    State.broker.sendLocally(enums.EUserMainTargets.Profile, enums.EProfileTargets.Create, res, data, EServices.Users);
  } catch (err) {
    const { message, code, name, status } = err as FullError;
    res.status(status).json({ message, code, name });
  }
});

export default router;
