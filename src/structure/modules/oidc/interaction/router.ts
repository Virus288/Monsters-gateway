import Router from './index';
import handleErr from '../../../../errors/utils';
import limitRate from '../../../utils';
import type * as types from '../../../../types';

const service = new Router();

/**
 * @openapi
 * /interaction/:grant:
 *   get:
 *     tags:
 *       - interaction
 *     description: Init oidc interaction
 *     responses:
 *       200:
 *         description: Success. Moved user to login site
 *       401:
 *         description: Incorrect oidc params.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
service.router.get('/:grant', limitRate, async (req, res, next) => {
  try {
    await service.get(req, res, next);
  } catch (err) {
    handleErr(err as types.IFullError, res);
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
service.router.post('/:grant/login', limitRate, async (req, res) => {
  try {
    await service.post(req, res);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
