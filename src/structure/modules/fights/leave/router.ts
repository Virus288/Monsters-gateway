import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /fights/leave:
 *   get:
 *     tags:
 *       - fights
 *     description: Get all users
 *     security:
 *       - bearerAuth: []
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
service.router.get('/leave', limitRate, async (req, res) => {
  try {
    await service.get(req, res);
    res.status(200).send();
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
