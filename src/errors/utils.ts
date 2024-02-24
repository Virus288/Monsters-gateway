import Log from '../tools/logger/log';
import type * as types from '../types';
import type express from 'express';

const handleErr = (err: types.IFullError, res: express.Response): void => {
  Log.error('Error', err.message, err.stack);

  const { message, code, name, status } = err;
  !status
    ? res.status(500).send({
        message,
        code,
        name,
      })
    : res.status(status).send({ message, code, name });
};

export default handleErr;
