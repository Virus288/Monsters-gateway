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

/**
 * @openapi
 * components:
 *   schemas:
 *     IPartyEntity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         leader:
 *           type: string
 *         characters:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - _id
 *         - leader
 *         - characters
 */
export interface IPartyEntity {
  _id: string;
  leader: string;
  characters: string[];
}
