import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /inventory:
 *   get:
 *     tags:
 *       - user
 *     description: Get user's name
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Get user's inventory back in request.
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UnauthorizedError'
 *                 - $ref: '#/components/schemas/MissingArgError'
 *                 - $ref: '#/components/schemas/IncorrectArgError'
 */

service.router.get('/', limitRate, (_req, res: types.ILocalUser) => {
  try {
    return service.get(res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
