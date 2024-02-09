/**
 * @openapi
 * components:
 *   schemas:
 *     IInventoryEntity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required:
 *               - itemId
 *               - quantity
 *       required:
 *         - _id
 *         - userId
 *         - items
 */

export interface IInventoryItem {
  itemId: string;
  quantity: number;
}

export interface IInventoryEntity {
  _id: string;
  userId: string;
  items: IInventoryItem[];
}
