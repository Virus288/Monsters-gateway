import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /logs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - logs
 *     description: Get user logs
 *     parameters:
 *       - in: query
 *         name: lastId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success. Get last 100 user's logs in request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ILogEntity'
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
service.router.get('/', limitRate, async (req, res) => {
  try {
    const data = await service.get(req, res);
    res.status(200).send({ data });
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
