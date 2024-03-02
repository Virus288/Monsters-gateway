import type { ECharacterState, EUserRace } from '../../../enums';

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
 *           enum: ['human', 'elf', 'goblin', 'dwarf', 'orc', 'fairy', 'dragonBorn']
 *         state:
 *           type: string
 *           enum: ['fight', 'map']
 *         friends:
 *           type: array
 *           items:
 *             type: string
 *         lvl:
 *           type: integer
 *         initialized:
 *           type: boolean
 *         inventory:
 *           type: string
 *         party:
 *           type: string
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
  race: EUserRace;
  friends: string[];
  lvl: number;
  exp: number[];
  initialized: boolean;
  inventory: string;
  party: string;
  state: ECharacterState;
}
