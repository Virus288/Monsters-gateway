import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /users/login:
 *   get:
 *     tags:
 *       - user
 *     description: Validate if user's token is valid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. The user is logged in.
 *       401:
 *         description: User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
service.router.get('/login', limitRate, (req, res: types.ILocalUser) => {
  try {
    const data = service.get(req, res);
    return res.status(200).send(data);
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *       - user
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
 *         headers:
 *           Authorization:
 *             description: The user's access token for authorization.
 *             schema:
 *               type: string
 *             example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *           x-refresh-token:
 *             description: The user's refresh token.
 *             schema:
 *               type: string
 *             example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
service.router.post('/login', limitRate, async (req, res: types.ILocalUser) => {
  try {
    await service.post(req, res);
    return res.status(200).send();
  } catch (err) {
    return handleErr(err as types.IFullError, res);
  }
});

export default service;
