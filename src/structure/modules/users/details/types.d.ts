/**
 * @openapi
 * components:
 *   schemas:
 *     IUserDetailsDto:
 *     parameters:
 *      - in: query
 *        name: name
 *        required: false
 *        schema:
 *          type: string
 *      - in: query
 *        name: id
 *        required: false
 *        schema:
 *          type: string
 */
export interface IUserDetailsDto {
  name?: string;
  id?: string;
}
