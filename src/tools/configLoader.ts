import Logger from './logger/log';
import devConfig from '../../config/devConfig.json';
import exampleConfig from '../../config/exampleConfig.json';
import prodConfig from '../../config/prodConfig.json';
import type * as types from '../types';

/**
 * Load config from json files
 */
export default function getConfig(): types.IConfigInterface {
  switch (process.env.NODE_ENV) {
    case 'dev':
    case 'test':
      if (devConfig.session) return devConfig;

      Logger.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    case 'prod':
      if (prodConfig.session) return prodConfig;

      Logger.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    default:
      throw new Error('No config files');
  }
}
