import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /logs:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - logs
 *     description: Request body to add new log
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/IAddLogDto'
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */

service.router.post('/', limitRate, async (req, res) => {
  try {
    const data = await service.get(req, res);
    res.status(200).send({ data });
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
