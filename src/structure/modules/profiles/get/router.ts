import Router from './index';
import handleErr from '../../../../errors/utils';
import type * as types from '../../../../types';
import limitRate from '../../../utils';

const service = new Router();

/**
 * @openapi
 * /profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - profile
 *     description: Get user profile
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfileEntity'
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
service.router.get('/', limitRate, (req, res: types.ILocalUser) => {
  try {
    return service.get(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
