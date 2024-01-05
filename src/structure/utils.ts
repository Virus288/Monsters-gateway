import rateLimit from 'express-rate-limit';
import type express from 'express';
import * as process from 'process';

const limiter =
  process.env.NODE_ENV === 'test'
    ? (_req: express.Request, _res: express.Response, next: express.NextFunction): void => {
        next();
      }
    : rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        message: 'Too many requests from this IP, please try again in an 1 min',
      });

export default limiter;
