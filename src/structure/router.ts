import login from './modules/users/login/router';
import register from './modules/users/register/router';
import logout from './modules/users/logout/router';
import profileRouter from './modules/profiles/router';
import type { Router } from 'express';

export default class AppRouter {
  private readonly _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  private get router(): Router {
    return this._router;
  }

  initRoutes(): void {
    const users = '/users';
    this.router.use(users, login.router).use(users, register.router).use(users, logout.router);
  }

  initSecured(): void {
    const profiles = '/profile';
    this.router.use(profiles, profileRouter.router);
  }
}
