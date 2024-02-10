import Log from './logger/log';
import devConfig from '../../config/devConfig.json';
import exampleConfig from '../../config/exampleConfig.json';
import prodConfig from '../../config/prodConfig.json';
import testDevConfig from '../../config/testConfig.json';
import type * as types from '../types';

/**
 * Load config from json files
 */
export default function getConfig(): types.IConfigInterface {
  switch (process.env.NODE_ENV) {
    case 'testDev':
      if (testDevConfig.session) return testDevConfig;
      Log.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    case 'dev':
    case 'test':
      if (devConfig.session) return devConfig;
      Log.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    case 'prod':
      if (prodConfig.session) return prodConfig;
      Log.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    default:
      throw new Error('No config files');
  }
}
