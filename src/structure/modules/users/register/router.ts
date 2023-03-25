import Router from './index';
import type * as types from '../../../../types';
import handleErr from '../../../../errors/utils';

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
 *             $ref: '#/components/schemas/IRegisterUserDto'
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
service.router.post('/register', (req, res: types.ILocalUser) => {
  try {
    return service.post(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
