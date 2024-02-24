/**
 * @openapi
 * components:
 *   schemas:
 *     IGetAllUsersDto:
 *       parameters:
 *         - in: query
 *           name: page
 *           required: true
 *           schema:
 *             type: number
 */
export interface IDebugGetAllUsersDto {
  page: number;
}
