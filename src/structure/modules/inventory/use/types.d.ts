/**
 * @openapi
 * components:
 *   schemas:
 *     IUseItemDto:
 *     parameters:
 *      - in: query
 *        name: itemId
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: amount
 *        required: true
 *        schema:
 *          type: string
 */
export interface IUseItemDto {
  itemId: string;
  amount: number;
}
