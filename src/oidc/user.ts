import UserDetailsDto from '../structure/modules/user/details/dto';
import ReqHandler from '../structure/reqHandler';
import type { IUserEntity } from '../types';
import type * as oidc from 'oidc-provider';

class UserAccount implements oidc.Account {
  private readonly _accountId: string;
  private readonly _reqHandler: ReqHandler;

  constructor(userId: string) {
    this._accountId = userId;
    this._reqHandler = new ReqHandler();
  }

  get accountId(): string {
    return this._accountId;
  }

  get reqHandler(): ReqHandler {
    return this._reqHandler;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async claims(_use: string, _scope: string): Promise<oidc.AccountClaims> {
    // #TODO This should return client based on scope. I don't use any other scopes currently
    // #TODO Currently broker require user locals to be present and there is no way to send req "as system"
    const callback = await this.reqHandler.user.getDetails([new UserDetailsDto({ id: this.accountId })], {
      userId: undefined,
      validated: false,
      tempId: undefined,
    });

    const account = callback.payload[0] as IUserEntity;

    return new Promise((resolve) => {
      resolve({
        ...account,
        sub: account._id,
      });
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const findAccount = (_ctx: oidc.KoaContextWithOIDC, id: string, _token: unknown): oidc.Account => {
  return new UserAccount(id);
};

export default findAccount;
