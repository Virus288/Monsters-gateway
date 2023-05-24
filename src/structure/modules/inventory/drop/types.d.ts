/**
 * @openapi
 * components:
 *   schemas:
 *     IDropItemDto:
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
export interface IDropItemDto {
  itemId: string;
  amount: number;
}
