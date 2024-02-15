/**
 * @openapi
 * components:
 *   schemas:
 *     IGetLogDto:
 *     parameters:
 *       - in: query
 *         name: lastId
 *         required: false
 *         schema:
 *           type: string
 */
export interface IGetLogDto {
  lastId?: string;
}
