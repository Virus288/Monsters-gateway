/**
 * @openapi
 * components:
 *   schemas:
 *     IProfileEntity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         race:
 *           type: string
 *           enum: ['human', 'elf']
 *         friends:
 *           type: array
 *           items:
 *             type: string
 *         lvl:
 *           type: integer
 *         exp:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 2
 *           maxItems: 2
 */
export interface IProfileEntity {
  _id: string;
  user: string;
  race: enums.EUserRace;
  friends: string[];
  lvl: number;
  exp: [number, number];
}