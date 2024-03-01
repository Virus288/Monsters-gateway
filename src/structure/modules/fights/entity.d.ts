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
