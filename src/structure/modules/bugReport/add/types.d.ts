/**
 * @openapi
 * components:
 *   schemas:
 *     IAddBugReport:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */
export interface IAddBugReport {
  message: string;
  user: string;
}
