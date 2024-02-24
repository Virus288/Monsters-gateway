import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /debug/interaction:
 *   post:
 *     tags:
 *       - interaction-debug
 *     description: Log in user
 *     security: []
 *     requestBody:
 *       description: Request body for logging in
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ILoginDto'
 *     responses:
 *       200:
 *         description: Success. The user is logged in.
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 */
service.router.post('/', limitRate, async (req, res) => {
  try {
    const data = await service.post(req, res);
    res.send(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
