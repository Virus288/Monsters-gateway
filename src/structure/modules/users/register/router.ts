import Router from './index';
import type * as types from '../../../../types';
import handleErr from '../../../../errors/utils';

const service = new Router();

service.router.post('/register', (req, res: types.ILocalUser) => {
  try {
    return service.post(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
