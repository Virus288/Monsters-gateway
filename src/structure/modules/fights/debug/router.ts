import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /debug/fights/create:
 *   get:
 *     tags:
 *       - fights-debug
 *     description: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Get users back in request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IUserEntity'
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
service.router.post('/create', limitRate, async (req, res) => {
  try {
    const data = await service.post(req, res);
    res.status(200).send(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
