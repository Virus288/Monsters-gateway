/**
 * @openapi
 * components:
 *   schemas:
 *     IUseItemDto:
 *       type: object
 *       properties:
 *         itemId:
 *           type: string
 *         amount:
 *           type: string
 *     parameters:
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: string
 */
export interface IUseItemDto {
  itemId: string;
  amount: number;
}
