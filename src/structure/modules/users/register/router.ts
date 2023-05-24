import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags:
 *       - user
 *     description: Register user
 *     security: []
 *     requestBody:
 *       description: Request body for registering user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IRegisterDto'
 *     responses:
 *       200:
 *         description: Success. User registered.
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
service.router.post('/register', limitRate, (req, res: types.ILocalUser) => {
  try {
    return service.post(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
