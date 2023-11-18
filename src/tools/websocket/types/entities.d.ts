export interface IUserMessageBody {
  messages: number;
  receiver: string;
  sender: string;
}

export interface IDetailedMessageBody {
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
 *     IUserMessageBody:
 *       type: object
 *       properties:
 *         messages:
 *           type: integer
 *         receiver:
 *           type: string
 *         sender:
 *           type: string
 *
 *     IUserMessagesEntity:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: 'message'
 *         payload:
 *           type: object
 *           properties:
 *             [key: string]:
 *               $ref: '#/components/schemas/IUserMessageBody'
 */
export interface IUserMessagesEntity {
  type: 'message';
  payload: Record<string, IUserMessageBody>;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IDetailedMessageBody:
 *       type: object
 *       properties:
 *         sender:
 *           type: string
 *         receiver:
 *           type: string
 *         read:
 *           type: boolean
 *         chatId:
 *           type: string
 *         message:
 *           type: string
 *
 *     IDetailedMessagesEntity:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: 'message'
 *         payload:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IDetailedMessageBody'
 */
export interface IDetailedMessagesEntity {
  type: 'message';
  payload: IDetailedMessageBody[];
}
