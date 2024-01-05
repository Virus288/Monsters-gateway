import type { IUsersTokens } from './user';
import type Provider from 'oidc-provider';

declare global {
  namespace express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Response {
      provider: Provider;
      locals: IUsersTokens;
    }
  }
}
