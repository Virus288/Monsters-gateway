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

export interface IPartyEntity {
  _id: string;
  leader: string;
  characters: string[];
}
