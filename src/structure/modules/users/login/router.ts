import Router from './index';
import { ILocalUser } from '../../../../types';

const Service = new Router();

Service.router.get('/login', (req, res: ILocalUser) => {
  Service.get(req, res);
});

Service.router.post('/login', (req, res: ILocalUser) => {
  Service.post(req, res);
});

export default Service;
