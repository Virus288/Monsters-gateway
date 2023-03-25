/**
 * @openapi
 * components:
 *   schemas:
 *     IRegisterUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         login:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: "^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 200
 *           pattern: "^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\\d).*$"
 *           description: Password should contain at least 1 digit, 6 letters, 1 uppercase letter, and 1 lowercase letter.
 */
export default class IRegisterUserDto {
  email: string;
  login: string;
  password: string;
}
