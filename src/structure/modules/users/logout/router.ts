import Router from './index';
import * as enums from '../../../../enums';
import type * as types from '../../../../types';

const service = new Router();

service.router.get('/logout', (_req, res: types.ILocalUser) => {
  res.cookie(enums.EJwt.AccessToken, '', { httpOnly: true, maxAge: enums.jwtTime.RemoveMaxAge });
  return res.status(200).send();
});

export default service;
