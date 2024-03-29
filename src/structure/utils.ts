import rateLimit from 'express-rate-limit';
import type express from 'express';
import * as process from 'process';

const limiter =
  process.env.NODE_ENV === 'test'
    ? (_req: express.Request, _res: express.Response, next: express.NextFunction): void => {
        next();
      }
    : rateLimit({
        limit: 200,
        message: { data: 'Too many requests from this IP, please try again in an 1 min' },
        validate: { trustProxy: true },
      });

export default limiter;
