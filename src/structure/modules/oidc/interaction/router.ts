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
 * /interaction/:grant:
 *   post:
 *     tags:
 *       - interaction
 *     description: Validate user input and create login token
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
 *         x-token-url:
 *           description: On success, user will be redirected to previously provided path with code in url
 *           value: "/code=....."
 */

service.router.post('/:grant/login', limitRate, async (req, res) => {
  try {
    await service.post(req, res);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
