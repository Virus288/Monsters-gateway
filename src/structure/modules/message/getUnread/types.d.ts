/**
 * @openapi
 * components:
 *   schemas:
 *     IGetUnreadMessagesDto:
 *     parameters:
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: number
 */
export interface IGetUnreadMessagesDto {
  page: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IUnreadMessage:
 *       type: object
 *       properties:
 *         lastMessage:
 *           type: number
 *         unread:
 *           type: number
 *         chatId:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - lastMessage
 *         - unread
 *         - chatId
 *         - participants
 */
export interface IUnreadMessage {
  lastMessage: number;
  unread: number;
  chatId: string;
  participants: string[];
}
