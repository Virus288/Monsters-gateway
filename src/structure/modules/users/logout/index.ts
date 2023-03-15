import express from 'express';

export default class UserRouter {
  private readonly _router: express.Router;

  constructor() {
    this._router = express.Router();
  }

  get router(): express.Router {
    return this._router;
  }
}
