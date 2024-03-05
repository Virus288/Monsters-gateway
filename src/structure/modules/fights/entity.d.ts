import type { IProfileEntity } from '../profile/entity';

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
  action: EAction;
  target: string;
  value: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IProfileUpdateEntity:
 *       type: object
 *       properties:
 *         state:
 *           type: string
 *           enum: ['fight', 'map']
 *       required:
 *         - state
 */
export type IProfileUpdateEntity = Partial<IProfileEntity>;
