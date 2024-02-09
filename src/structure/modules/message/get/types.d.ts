/**
 * @openapi
 * components:
 *   schemas:
 *     IGetMessagesDto:
 *     parameters:
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: number
 */
export interface IGetMessagesDto {
  page: number;
  target: string | undefined;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IFullMessageEntity:
 *       type: object
 *       properties:
 *         sender:
 *           type: string
 *         receiver:
 *           type: string
 *         messages:
 *           type: string
 *         read:
 *           type: boolean
 *         chatId:
 *           type: string
 *       required:
 *         - sender
 *         - receiver
 *         - messages
 *         - read
 *         - chatId
 */
export interface IFullMessageEntity {
  sender: string;
  receiver: string;
  read: boolean;
  chatId: string;
  message: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IPreparedMessagesBody:
 *       type: object
 *       properties:
 *         sender:
 *           type: string
 *         receiver:
 *           type: string
 *         messages:
 *           type: string
 *       required:
 *         - sender
 *         - receiver
 *         - messages
 */
export interface IPreparedMessagesBody {
  sender: string;
  receiver: string;
  messages: number;
}
