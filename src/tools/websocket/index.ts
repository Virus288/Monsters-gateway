import Websocket from 'ws';
import Log from '../logger/log';
import getConfig from '../configLoader';
import * as errors from '../../errors';
import type * as types from '../../types';
import * as enums from '../../enums';
import { ESocketType } from '../../enums';
import Router from './router';
import jwt from 'jsonwebtoken';

export default class WebsocketServer {
  private _users: types.ISocketUser[] = [];
  private readonly _router: Router;

  constructor() {
    this._router = new Router();
  }

  private get router(): Router {
    return this._router;
  }

  private _server: Websocket.WebSocketServer;

  private get server(): Websocket.WebSocketServer {
    return this._server;
  }

  init(): void {
    this._server = new Websocket.Server({
      port: getConfig().socketPort,
    });
    Log.log('Socket', `Started socket on port ${getConfig().socketPort}`);
    this.startListeners();
  }

  close(): void {
    this.server.close();
    this._users.forEach((u) => {
      u.user.close(1000, JSON.stringify(new errors.InternalError()));
      this.userDisconnected(u.user);
    });
  }

  startListeners(): void {
    this.server.on('connection', (ws, req) => {
      this.errorWrapper(() => this.onUserConnected(ws, req.headers.authorization), ws);
    });
    this.server.on('error', (err) => this.handleServerError(err));
    this.server.on('close', () => Log.error('Websocket', 'Server closed'));
  }

  sendToUser(userId: string, message: string): void {
    const formatted: types.ISocketOutMessage = { type: ESocketType.Message, payload: message };
    const target = this._users.find((e) => {
      return e.userId === userId;
    });

    return target === undefined ? null : target.user.send(JSON.stringify(formatted));
  }

  isOnline(user: string): boolean {
    const exist = this._users.find((u) => {
      return u.userId === user;
    });
    return exist !== undefined;
  }

  private onUserConnected(ws: types.ISocket, token: string): void {
    this.validateUser(ws, token);

    ws.on('message', (message: string) => this.errorWrapper(() => this.handleUserMessage(message, ws), ws));
    ws.on('pong', () => this.errorWrapper(() => this.pong(ws), ws));
    ws.on('error', (error) => this.router.handleError(error as types.IFullError, ws));
    ws.on('close', () => this.userDisconnected(ws));
  }

  private validateUser(ws: types.ISocket, token: string): void {
    const errBody = JSON.stringify({
      type: enums.ESocketType.Error,
      payload: new errors.Unauthorized(),
    });

    if (!token) return ws.close(1000, errBody);
    const prepared = token.split(' ')[1].trim();

    try {
      const { id, type } = jwt.verify(prepared, getConfig().accessToken) as {
        id: string;
        type: enums.EUserTypes;
      };
      ws.userId = id;
      this._users.push({ user: ws, userId: id, type });
    } catch (err) {
      ws.close(1000, errBody);
    }
  }

  private userDisconnected(ws: types.ISocket): void {
    if (!ws.userId) return;
    this._users = this._users.filter((u) => {
      return u.userId !== ws.userId;
    });
  }

  private handleUserMessage(mess: string, ws: types.ISocket): void {
    let message: types.ISocketInMessage = { payload: undefined, subTarget: undefined, target: undefined };

    try {
      message = JSON.parse(mess) as types.ISocketInMessage;
    } catch (err) {
      return this.router.handleError(new errors.IncorrectBodyType(), ws);
    }

    switch (message.target) {
      case enums.ESocketTargets.Messages:
        return this.router.handleMessage(message, ws);
      case undefined:
        return this.router.handleError(new errors.IncorrectTarget(), ws);
    }
  }

  private pong(ws: types.ISocket): void {
    ws.pong();
  }

  private errorWrapper(callback: () => void, ws: Websocket.WebSocket): void {
    try {
      callback();
    } catch (err) {
      this.router.handleError(err as types.IFullError, ws);
    }
  }

  private handleServerError(err: Error): void {
    Log.error('Socket', err);
    this.close();
  }
}
