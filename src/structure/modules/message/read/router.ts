import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /messages/read:
 *   patch:
 *     tags:
 *       - messages
 *     description: Read user messages
 *     parameters:
 *       - in: query
 *         name: receiver
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Read message
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

service.router.patch('/read', limitRate, (req, res: types.ILocalUser) => {
  try {
    return service.patch(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
