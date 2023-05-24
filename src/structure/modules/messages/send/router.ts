import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /messages/read:
 *   put:
 *     tags:
 *       - messages
 *     description: Send message to user
 *    parameters:
 *      - in: query
 *        name: body
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: receiver
 *        required: true
 *        schema:
 *          type: string
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Message sent
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
service.router.put('/send', limitRate, (req, res: types.ILocalUser) => {
  try {
    return service.put(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
