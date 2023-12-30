import type { IGetDetailedBody, IGetMessageBody, IReadMessageBody, ISocketSendMessageBody } from './index';
import type { EMessageSubTargets, ESocketTargets } from '../../../enums';

/**
 * @openapi
 * components:
 *   schemas:
 *     IReadMessageDto:
 *       type: object
 *       properties:
 *         target:
 *           type: string
 *           example: 'chat'
 *         subTarget:
 *           type: string
 *           example: 'send'
 *         payload:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: Receiver's id
 *             chatId:
 *               type: string
 *               description: Conversation id
 */
export interface IReadMessageDto {
  target: ESocketTargets.Chat;
  subTarget: EMessageSubTargets.Read;
  payload: IReadMessageBody;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IGetDetailedDto:
 *       type: object
 *       properties:
 *         target:
 *           type: string
 *           example: 'chat'
 *         subTarget:
 *           type: string
 *           example: 'send'
 *         payload:
 *           type: object
 *           properties:
 *             page:
 *               type: number
 *               description: Message's page
 *             target:
 *               type: string
 *               description: Conversation id
 */

export interface IGetDetailedDto {
  target: ESocketTargets.Chat;
  subTarget: EMessageSubTargets.Get;
  payload: IGetDetailedBody;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ISocketSendMessageDto:
 *       type: object
 *       properties:
 *         target:
 *           type: string
 *           example: 'chat'
 *         subTarget:
 *           type: string
 *           example: 'send'
 *         payload:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Message body
 *             target:
 *               type: string
 *               description: Receiver's id
 */

export interface ISocketSendMessageDto {
  target: ESocketTargets.Chat;
  subTarget: EMessageSubTargets.Get;
  payload: ISocketSendMessageBody;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IGetMessageDto:
 *       type: object
 *       properties:
 *         target:
 *           type: string
 *           example: 'chat'
 *         subTarget:
 *           type: string
 *           example: 'send'
 *         payload:
 *           type: object
 *           properties:
 *             page:
 *               type: number
 *               description: Message's page
 */

export interface IGetMessageDto {
  target: ESocketTargets.Chat;
  subTarget: EMessageSubTargets.Get;
  payload: IGetMessageBody;
}
