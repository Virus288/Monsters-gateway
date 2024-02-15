/**
 * @openapi
 * components:
 *   schemas:
 *     ILogEntity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         message:
 *           type: string
 *         date:
 *           type: string
 */
export interface ILogEntity {
  _id: string;
  message: string;
  date: string;
}
