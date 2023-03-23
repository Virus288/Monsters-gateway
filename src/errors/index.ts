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

export class Unauthorized extends FullError {
  constructor() {
    super('Unauthorized');
    this.message = 'User not logged in';
    this.name = 'Unauthorized';
    this.code = '003';
    this.status = 401;
  }
}

export class MissingProcessPlatform extends FullError {
  constructor() {
    super('MissingProcessPlatform');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatform';
    this.code = '004';
    this.status = 400;
  }
}

export class NoDataProvided extends FullError {
  constructor(target?: string) {
    super('NoDataProvided');
    this.message = target ? `${target} not provided` : 'No data provided';
    this.name = 'NoDataProvided';
    this.code = '005';
    this.status = 400;
  }
}

export class IncorrectBodyType extends FullError {
  constructor() {
    super('IncorrectBodyType');
    this.message = 'Incorrect body type';
    this.name = 'IncorrectBodyType';
    this.code = '006';
    this.status = 400;
  }
}

export class IncorrectTarget extends FullError {
  constructor() {
    super('IncorrectTarget');
    this.message = 'Incorrect target';
    this.name = 'IncorrectTarget';
    this.code = '007';
    this.status = 400;
  }
}

export class MissingArg extends FullError {
  constructor(param: string) {
    super('MissingArg');
    this.message = `Missing param: ${param}`;
    this.name = 'MissingArg';
    this.code = '008';
    this.status = 400;
  }
}

export class IncorrectArg extends FullError {
  constructor(err: string) {
    super('IncorrectArg');
    this.message = err;
    this.name = 'IncorrectArg';
    this.code = '008';
    this.status = 400;
  }
}
