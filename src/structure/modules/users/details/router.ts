import Router from './index';
import type * as types from '../../../../types';
import handleErr from '../../../../errors/utils';

const service = new Router();

/**
 * @openapi
 * /users/details:
 *   post:
 *     tags:
 *       - user
 *     description: Get user's name
 *     parameters:
 *      - in: query
 *        name: name
 *        required: false
 *        schema:
 *          type: string
 *      - in: query
 *        name: id
 *        required: false
 *        schema:
 *          type: string
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Get user's name back in request.
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
service.router.get('/details', (req, res: types.ILocalUser) => {
  try {
    return service.get(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
