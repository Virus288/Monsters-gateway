/**
 * @openapi
 * components:
 *   schemas:
 *     IGetFightDto:
 *       type: object
 *       properties:
 *         target:
 *           type: string
 *         page:
 *           type: number
 */
export interface IGetFightDto {
  active: boolean;
  page?: number;
}
