import type { EFightAction } from '../../../enums';

/**
 * @openapi
 * components:
 *   schemas:
 *     IActionEntity:
 *       type: object
 *       properties:
 *         character:
 *           type: string
 *         action:
 *           type: string
 *         target:
 *           type: string
 *         value:
 *           type: number
 *       required:
 *         - character
 *         - action
 *         - target
 *         - value
 */
export interface IActionEntity {
  character: string;
  action: EFightAction;
  target: string;
  value: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IFightLogsEntity:
 *       type: object
 *       properties:
 *         logs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               phase:
 *                 type: number
 *               actions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/IActionEntity'
 */
export interface IFightLogsEntity {
  logs: { phase: number; actions: IActionEntity[] }[];
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IFightTeam:
 *       type: object
 *       properties:
 *         character:
 *           type: string
 *         action:
 *           type: string
 *         target:
 *           type: string
 *         value:
 *           type: number
 */
export interface IFightTeam {
  character: string;
  action: string;
  target: string;
  value: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IState:
 *       type: object
 *       properties:
 *         initialized:
 *           type: object
 *           properties:
 *             teams:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IStateTeam'
 *         current:
 *           type: object
 *           properties:
 *             teams:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IStateTeam'
 */
export interface IState {
  initialized: { teams: IFightTeam[][] };
  current: { teams: IFightTeam[][] };
}

export interface IFightEntity {
  log: string;
  states: string;
  attacker: string;
  active: boolean;
  phase: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IFight:
 *       type: object
 *       properties:
 *         states:
 *           $ref: '#/components/schemas/IState'
 *         log:
 *           $ref: '#/components/schemas/IFightLogsEntity'
 */
export interface IFight extends IFightEntity {
  states: IState;
  log: IFightLogsEntity;
}
