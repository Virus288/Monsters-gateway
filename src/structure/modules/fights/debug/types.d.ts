/**
 * @openapi
 * components:
 *   schemas:
 *     IFightProfile:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         lvl:
 *           type: number
 *         exp:
 *           type: array
 *           items:
 *             type: number
 *             format: int64
 *             minimum: 0
 *             maximum: 9223372036854775807
 *             description: Array containing current experience and total experience
 *         inventory:
 *           type: string
 */
export interface IFightProfile {
  userName: string;
  userId: string;
  lvl: number;
  exp: [number, number];
  inventory: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ICreateFightDto:
 *       type: object
 *       properties:
 *         attacker:
 *           type: string
 *         teams:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/IFightProfile'
 */
export interface ICreateFightDto {
  teams: [IFightProfile[], IFightProfile[]];
  attacker: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ICreateFight:
 *       type: object
 *       properties:
 *         teams:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/IFightProfile'
 *         owner:
 *           type: string
 */
export interface ICreateFight {
  team: string[];
}
