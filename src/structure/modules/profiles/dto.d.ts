// eslint-disable-next-line max-classes-per-file
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
export class IAddProfileDto {
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
export class IGetProfileDto {
  id: string;
}
