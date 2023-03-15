import Router from './index';
import * as enums from '../../../../enums';
import * as types from '../../../../types';

const Service = new Router();

Service.router.get('/logout', (_req, res: types.ILocalUser) => {
  res.cookie(enums.EJwt.AccessToken, '', { httpOnly: true, maxAge: enums.EJwtTime.RemoveMaxAge });
  return res.status(200).send();
});

export default Service;
