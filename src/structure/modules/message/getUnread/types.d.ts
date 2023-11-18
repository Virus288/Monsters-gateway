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

export interface IUnreadMessage {
  lastMessage: number;
  unread: number;
  chatId: string;
  participants: string[];
}
