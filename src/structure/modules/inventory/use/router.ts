import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /inventory:
 *   post:
 *     tags:
 *       - inventory
 *     description: Use item from inventory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body for using item from inventory
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IUseItemDto'
 *     responses:
 *       200:
 *         description: Success. Empty response.
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/NoDataProvidedError'
 *                 - $ref: '#/components/schemas/MissingArgError'
 *                 - $ref: '#/components/schemas/IncorrectArgError'
 *       401:
 *         description: User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
service.router.post('/', limitRate, (req, res: types.ILocalUser) => {
  try {
    return service.post(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
