import type { EUserRace } from '../../../../enums';

/**
 * @openapi
 * components:
 *   schemas:
 *     IAddProfileDto:
 *       type: object
 *       properties:
 *         race:
 *           type: string
 *           enum: ['human', 'elf']
 */
export interface IAddProfileDto {
  race: EUserRace;
}
