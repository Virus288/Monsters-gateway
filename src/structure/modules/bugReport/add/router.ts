import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /bug:
 *   post:
 *     tags:
 *       - bug report
 *     description: Add bug report
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body for adding bug report
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IAddBugReport'
 *     responses:
 *       200:
 *         description: Success. Report added
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

service.router.post('/', limitRate, async (req, res) => {
  try {
    await service.post(req, res);
    res.status(200).send();
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
