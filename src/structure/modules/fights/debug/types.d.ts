/**
 * @openapi
 * components:
 *   schemas:
 *     IStateTeam:
 *       type: object
 *       properties:
 *         character:
 *           type: string
 */
export interface IFightStateTeam {
  character: string;
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
 *               $ref: '#/components/schemas/IStateTeam'
 */
export interface ICreateFightDto {
  teams: [IFightStateTeam[], IFightStateTeam[]];
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
 *             type: string
 */
export interface ICreateFight {
  team: string[];
}
