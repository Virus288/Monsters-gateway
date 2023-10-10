import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /users/refresh:
 *   get:
 *     tags:
 *       - user
 *     description: Refresh user's access token
 *     security:
 *       - refreshToken: []
 *     responses:
 *       200:
 *         description: Success. Token refreshed
 *         headers:
 *           Authorization:
 *             description: The user's access token for authorization.
 *             schema:
 *               type: string
 *             example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncorrectRefreshTokenError'
 */
service.router.get('/refresh', limitRate, (req, res: types.ILocalUser) => {
  try {
    return service.get(req, res);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
