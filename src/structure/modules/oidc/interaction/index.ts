import RouterFactory from '../../../../tools/abstracts/router';
import getConfig from '../../../../tools/configLoader';
import Logger from '../../../../tools/logger/log';
import type express from 'express';
import type Provider from 'oidc-provider';
import type { InteractionResults } from 'oidc-provider';

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
        Logger.error('Oidc', 'Provider was not initialized');
        return;
      }
      const interactionDetails = await provider.interactionDetails(req, res);

      const { prompt } = interactionDetails;

      switch (prompt.name) {
        case 'login':
          res.type('html');
          res.render('login', { url: `${getConfig().corsOrigin as string}/interaction/${req.params.grant}/login` });
          break;
        case 'consent':
          // eslint-disable-next-line no-case-declarations
          // Grab user's login from session. Make sure that post saves login to session on success
          // eslint-disable-next-line no-case-declarations
          const consent: InteractionResults = {
            login: {
              account: '2',
            },
          };
          consent.rejectedScopes = [];
          consent.rejectedClaims = [];
          consent.replace = false;

          await provider.interactionFinished(req, res, consent, { mergeWithLastSubmission: false });
          break;
        default:
          next();
          break;
      }
    } catch (err) {
      Logger.error('Oidc Err', err);
      next(err);
    }
  }

  async post(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { provider } = this;
      if (!provider) {
        Logger.error('Oidc', 'Provider was not initialized');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.session.userId = '2';
      // Grab user's login from session. Make sure that post saves login to session on success
      const details = await provider.interactionDetails(req, res);

      const result = {
        login: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          account: (req.session as Record<string, string>).userId as string,
          remember: true,
        },
        consent: {
          rejectedScopes: [],
          rejectedClaims: [],
          rememberFor: 3600,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          scope: details.params.scope,
        },
      };

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      Logger.error('Oidc Err', err);
      next(err);
    }
  }
}
