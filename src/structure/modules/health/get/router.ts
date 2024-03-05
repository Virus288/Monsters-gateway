import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - health
 *     description: Check if services are responding
 *     responses:
 *       200:
 *         description: Success. Got information about services
 */
service.router.get('/', limitRate, (req, res) => {
  try {
    const data = service.get(req, res);
    res.status(200).send({ data });
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
