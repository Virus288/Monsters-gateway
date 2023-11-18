/**
 * @openapi
 * components:
 *   schemas:
 *     IReadMessageDto:
 *       type: object
 *       properties:
 *         chatId:
 *           type: string
 *         receiver:
 *           type: string
 */
export interface IReadMessageDto {
  chatId: string;
  receiver: string;
}
