/**
 * @openapi
 * components:
 *   schemas:
 *     ISendMessageDto:
 *       type: object
 *       properties:
 *         body:
 *           type: string
 *         receiver:
 *           type: string
 */
export interface ISendMessageDto {
  body: string;
  receiver: string;
  sender: string;
}
