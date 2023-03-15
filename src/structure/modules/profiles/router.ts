import Router from './index';
import * as types from '../../../types';

const Service = new Router();

Service.router.get('/', (req, res: types.ILocalUser) => {
  Service.get(req, res);
});

Service.router.post('/', (req, res: types.ILocalUser) => {
  Service.post(req, res);
});

export default Service;
