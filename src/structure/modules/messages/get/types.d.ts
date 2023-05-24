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
}
