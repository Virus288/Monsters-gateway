/**
 * @openapi
 * components:
 *   schemas:
 *     IAddLogDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         target:
 *           type: string
 */
export interface IAddLogDto {
  message: string;
  target: string;
}
