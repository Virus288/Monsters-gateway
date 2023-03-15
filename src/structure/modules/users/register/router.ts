import Router from './index';
import * as types from '../../../../types';

const Service = new Router();

Service.router.post('/register', (req, res: types.ILocalUser) => {
  return Service.post(req, res);
});

export default Service;
