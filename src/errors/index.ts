// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
  userId = undefined;
}

export class InternalError extends FullError {
  constructor() {
    super('InternalError');
    this.message = 'Internal error. Try again later';
    this.name = 'InternalError';
    this.code = '001';
    this.status = 500;
  }
}

export class NotFoundError extends FullError {
  constructor() {
    super('NotFoundError');
    this.message = 'Resource not found';
    this.name = 'NotFoundError';
    this.code = '002';
    this.status = 404;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'UnauthorizedError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '003'
 *         message:
 *           description: Error message describing the error cause.
 *           type: string
 *           example: 'User not logged in'
 */
export class UnauthorizedError extends FullError {
  constructor() {
    super('UnauthorizedError');
    this.message = 'User not logged in';
    this.name = 'UnauthorizedError';
    this.code = '003';
    this.status = 401;
  }
}

export class MissingProcessPlatformError extends FullError {
  constructor() {
    super('MissingProcessPlatformError');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatformError';
    this.code = '004';
    this.status = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectBodyTypeError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectBodyTypeError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '005'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "Incorrect body type. Data should be of type json"
 */
export class IncorrectBodyTypeError extends FullError {
  constructor() {
    super('IncorrectBodyTypeError');
    this.message = 'Incorrect body type. Data should be of type json';
    this.name = 'IncorrectBodyTypeError';
    this.code = '005';
    this.status = 400;
  }
}

export class IncorrectTargetError extends FullError {
  constructor() {
    super('IncorrectTargetError');
    this.message = 'Incorrect target';
    this.name = 'IncorrectTargetError';
    this.code = '006';
    this.status = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     MissingArgError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'MissingArgError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '007'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "^Missing param: .+$"
 */
export class MissingArgError extends FullError {
  constructor(param: string) {
    super('MissingArgError');
    this.message = `Missing param: ${param}`;
    this.name = 'MissingArgError';
    this.code = '007';
    this.status = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectArgError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectArgError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '008'
 *         message:
 *           example: 'Data not provided'
 *           description: Error message describing the incorrect parameter.
 *           type: string
 */
export class IncorrectArgError extends FullError {
  constructor(err: string) {
    super('IncorrectArgError');
    this.message = err;
    this.name = 'IncorrectArgError';
    this.code = '008';
    this.status = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     NoDataProvidedError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'NoDataProvidedError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '009'
 *         message:
 *           example: 'No data provided'
 *           description: Error message describing the incorrect parameter.
 *           type: string
 */
export class NoDataProvidedError extends FullError {
  constructor() {
    super('NoDataProvidedError');
    this.message = 'No data provided';
    this.name = 'NoDataProvidedError';
    this.code = '009';
    this.status = 400;
  }
}
