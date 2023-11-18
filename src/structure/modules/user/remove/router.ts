import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /users:
 *   delete:
 *     tags:
 *       - user
 *     description: Remove user
 *     security: []
 *     requestBody:
 *       description: Request body for removing user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IRemoveUserDto'
 *     responses:
 *       200:
 *         description: Success. User removed.
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/NoDataProvidedError'
 *                 - $ref: '#/components/schemas/MissingArgError'
 *                 - $ref: '#/components/schemas/IncorrectArgError'
 */
service.router.delete('/', limitRate, async (req, res: types.ILocalUser) => {
  try {
    await service.delete(req, res);
    res.status(200).send();
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
