import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /fights/logs:
 *   get:
 *     tags:
 *       - fights
 *     description: Get logs from fight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body for getting fight logs
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IGetFightLogsDto'
 *     responses:
 *       200:
 *         description: Success. Get fight logs back
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IFightLogsEntity'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/MissingArgError'
 *                 - $ref: '#/components/schemas/IncorrectArgError'
 *               description: Either required arguments are missing or provided arguments are incorrect.
 *       401:
 *         description: User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
service.router.get('/logs', limitRate, async (req, res) => {
  try {
    const data = await service.get(req, res);
    res.status(200).send({ data });
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
