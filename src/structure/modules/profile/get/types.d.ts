/**
 * @openapi
 * components:
 *   schemas:
 *     IGetProfileDto:
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export interface IGetProfileDto {
  id: string;
}
