import State from '../../../../state';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IHealth } from '../types';
import type express from 'express';

export default class HealthRouter extends RouterFactory {
  get(_req: express.Request, _res: express.Response): IHealth {
    return State.broker.getHealth();
  }
}
