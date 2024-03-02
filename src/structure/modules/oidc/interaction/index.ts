import LoginDto from './dto';
import { ProviderNotInitialized } from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import getConfig from '../../../../tools/configLoader';
import Log from '../../../../tools/logger';
import type * as types from '../../../../types';
import type ReqHandler from '../../../reqHandler';
import type express from 'express';
import type Provider from 'oidc-provider';

export default class UserRouter extends RouterFactory {
  private _provider: Provider | undefined;

  private get provider(): Provider | undefined {
    return this._provider;
  }

  private set provider(value: Provider) {
    this._provider = value;
  }

  init(provider: Provider): void {
    this.provider = provider;
  }

  async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { provider } = this;
      if (!provider) {
        Log.error('Oidc', 'Provider was not initialized');
        throw new ProviderNotInitialized();
      }
      const interactionDetails = await provider.interactionDetails(req, res);
      const { prompt } = interactionDetails;

      switch (prompt.name) {
        case 'login':
          res.type('html');
          res.render('login', { url: `${getConfig().myAddress}/interaction/${req.params.grant}/login` });
          return;
        default:
          next();
      }
    } catch (err) {
      Log.error('Oidc get Err', { message: (err as types.IFullError).message, stack: (err as types.IFullError).stack });
      res.type('html');

      if ((err as types.IFullError).name === 'SessionNotFound') {
        res.render('error', {
          name: (err as types.IFullError).name,
          message: (err as types.IFullError).message,
        });
      } else {
        res.render('login', {
          url: `${getConfig().myAddress}/interaction/${req.params.grant}/login`,
          error: (err as types.IFullError).message,
        });
      }
    }
  }

  async post(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { provider } = this;
      if (!provider) {
        Log.error('Oidc', 'Provider was not initialized');
        return;
      }

      const data = new LoginDto(req.body as LoginDto);
      const account = await (res.locals.reqHandler as ReqHandler).user.login(data, res.locals as types.IUsersTokens);

      (req.session as types.IUserSession).userId = account.payload.id;
      const details = await provider.interactionDetails(req, res);

      const result = {
        login: {
          account: (req.session as types.IUserSession).userId,
          remember: true,
        },
        consent: {
          rejectedScopes: [],
          rejectedClaims: [],
          rememberFor: 3600,
          scope: (details.params as Record<string, unknown>).scope,
        },
      };

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      Log.error('Oidc post Err', {
        message: (err as types.IFullError).message,
        stack: (err as types.IFullError).stack,
      });
      res.type('html');

      if ((err as types.IFullError).name === 'SessionNotFound') {
        res.render('error', {
          name: (err as types.IFullError).name,
          message: (err as types.IFullError).message,
        });
      } else {
        res.render('login', {
          url: `${getConfig().myAddress}/interaction/${req.params.grant}/login`,
          error: (err as types.IFullError).message,
          userName: (req.body as LoginDto)?.login,
        });
      }
    }
  }
}
