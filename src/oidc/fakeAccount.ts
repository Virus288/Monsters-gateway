import type { Account, AccountClaims, KoaContextWithOIDC } from 'oidc-provider';

class UserAccount implements Account {
  private readonly _accountId: string;

  constructor(userId: string) {
    this._accountId = userId;
  }

  get accountId(): string {
    return this._accountId;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async claims(_use: string, _scope: string): Promise<AccountClaims> {
    return new Promise((resolve) => {
      resolve({
        sub: '1',
        id: 1,
        login: 'amadmin',
        name: 'Name',
        surname: 'Surname',
        email: 'test@test.test',
        blocked: 0,
        countryId: null,
        lang: null,
        gender: 'female',
        access: {},
      });
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const findAccount = (_ctx: KoaContextWithOIDC, id: string, _token: unknown): Account => {
  return new UserAccount(id);
};

export default findAccount;
