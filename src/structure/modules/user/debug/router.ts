import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /users/debug:
 *   get:
 *     tags:
 *       - user-debug
 *     description: Get all users
 *     parameters:
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: number
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Get users back in request.
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
service.router.get('/debug', limitRate, async (req, res) => {
  try {
    const data = await service.get(req, res);
    res.status(200).send(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
