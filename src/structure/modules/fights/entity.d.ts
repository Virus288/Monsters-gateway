/**
 * @openapi
 * components:
 *   schemas:
 *     IUserEntity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         login:
 *           type: string
 *         verified:
 *           type: string
 *       required:
 *         - _id
 *         - login
 *         - verified
 */
export interface IUserEntity {
  _id: string;
  login: string;
  verified: boolean;
}
