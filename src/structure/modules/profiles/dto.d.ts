import type { EUserRace } from '../../../enums';

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
