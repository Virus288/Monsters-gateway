/**
 * @openapi
 * components:
 *   schemas:
 *     IGetPartyDto:
 *     parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 */
export interface IGetPartyDto {
  id: string;
}
