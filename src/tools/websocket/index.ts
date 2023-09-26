import jwt from 'jsonwebtoken';
import Websocket from 'ws';
import Router from './router';
import * as enums from '../../enums';
import * as errors from '../../errors';
import getConfig from '../configLoader';
import Log from '../logger/log';
import type * as types from './types';
import type { ESocketType } from '../../enums';
import type { IFullError } from '../../types';

export default class WebsocketServer {
  private readonly _router: Router;

  constructor() {
    this._router = new Router();
  }

  private _users: types.ISocketUser[] = [];

  private get users(): types.ISocketUser[] {
    return this._users;
  }

  private get router(): Router {
    return this._router;
  }

  private _server: Websocket.WebSocketServer | null = null;

  private get server(): Websocket.WebSocketServer {
    return this._server!;
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
    this.users.forEach((u) => {
      u.clients.forEach((c) => {
        c.close(1000, JSON.stringify(new errors.InternalError()));
        this.userDisconnected(c);
      });
    });
  }

  startListeners(): void {
    this.server.on('connection', (ws: types.ISocket, req) => {
      this.errorWrapper(() => this.onUserConnected(ws, req.headers.cookie), ws);
    });
    this.server.on('error', (err) => this.handleServerError(err));
    this.server.on('close', () => Log.log('Websocket', 'Server closed'));
  }

  sendToUser(userId: string, payload: unknown, type: ESocketType = enums.ESocketType.Message): void {
    const formatted: types.ISocketOutMessage = { type, payload };
    const target = this.users.find((e) => {
      return e.userId === userId;
    });

    if (target) target.clients.forEach((c) => c.send(JSON.stringify(formatted)));
  }

  isOnline(user: string): boolean {
    const exist = this.users.find((u) => {
      return u.userId === user;
    });
    return exist !== undefined;
  }

  private onUserConnected(ws: types.ISocket, cookies: string | undefined): void {
    this.validateUser(ws, cookies);

    ws.on('message', (message: string) => this.errorWrapper(() => this.handleUserMessage(message, ws), ws));
    ws.on('pong', () => this.errorWrapper(() => this.pong(ws), ws));
    ws.on('error', (error) => this.router.handleError(error as IFullError, ws));
    ws.on('close', () => this.userDisconnected(ws));
  }

  private validateUser(ws: types.ISocket, cookies: string | undefined): void {
    const errBody = JSON.stringify({
      type: enums.ESocketType.Error,
      payload: new errors.UnauthorizedError(),
    });

    if (!cookies) return ws.close(1000, errBody);

    const accessToken = cookies
      .split(';')
      .map((e) => e.split('='))
      .find((e) => e[0] === 'accessToken');
    if (!accessToken || accessToken.length === 0) return ws.close(1000, errBody);
    const prepared = accessToken[1]!;

    try {
      const { id, type } = jwt.verify(prepared, getConfig().accessToken) as {
        id: string;
        type: enums.EUserTypes;
      };
      ws.userId = id;

      const isAlreadyOnline = this.users.findIndex((u) => {
        return u.userId === id;
      });

      // #TODO This is broken and incorrectly sends messages back to user, who is logged in on 2 devices
      if (isAlreadyOnline > -1) {
        this._users[isAlreadyOnline] = {
          ...this.users[isAlreadyOnline],
          userId: this.users[isAlreadyOnline]!.userId,
          type: this.users[isAlreadyOnline]!.type,
          clients: [...this.users[isAlreadyOnline]!.clients, ws],
        };
        return undefined;
      }
      this._users.push({ clients: [ws], userId: id, type });
      return undefined;
    } catch (err) {
      return ws.close(1000, errBody);
    }
  }

  private userDisconnected(ws: types.ISocket): void {
    if (!ws.userId) return;
    this._users = this.users.filter((u) => {
      return u.userId !== ws.userId;
    });
  }

  private handleUserMessage(mess: string, ws: types.ISocket): void {
    let message: types.ISocketInMessage = { payload: undefined, subTarget: undefined!, target: undefined! };

    try {
      message = JSON.parse(mess) as types.ISocketInMessage;
    } catch (err) {
      return this.router.handleError(new errors.IncorrectBodyTypeError(), ws);
    }

    switch (message.target) {
      case enums.ESocketTargets.Chat:
        return this.router.handleChatMessage(message, ws);
      default:
        return this.router.handleError(new errors.IncorrectTargetError(), ws);
    }
  }

  private pong(ws: types.ISocket): void {
    ws.pong();
  }

  private errorWrapper(callback: () => void, ws: types.ISocket): void {
    try {
      callback();
    } catch (err) {
      this.router.handleError(err as IFullError, ws);
    }
  }

  private handleServerError(err: Error): void {
    const error = err as IFullError;
    Log.error('Socket', error.message, error.stack);
    this.close();
  }
}
