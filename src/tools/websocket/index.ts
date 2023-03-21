import Websocket from 'ws';
import Log from '../logger/log';
import getConfig from '../configLoader';
import * as errors from '../../errors';
import type { ISocket, ISocketMessage, ISocketUser } from '../../types';
import type * as enums from '../../enums';
import { ESocketTargets } from '../../enums';
import Router from './router';
import jwt from 'jsonwebtoken';

export default class WebsocketServer {
  private _users: ISocketUser[] = [];
  private _router: Router;

  constructor() {
    this._router = new Router();
  }

  private _server: Websocket.WebSocketServer;

  private get server(): Websocket.WebSocketServer {
    return this._server;
  }

  start(): void {
    this._server = new Websocket.Server({
      port: getConfig().socketPort,
    });
    Log.log('Socket', `Started socket on port ${getConfig().socketPort}`);
    this.startListeners();
  }

  close(): void {
    this.server.close();
  }

  startListeners(): void {
    this.server.on('connection', (ws, req) => {
      this.errorWrapper(() => this.onUserConnected(ws, req.headers.authorization));
    });
    this.server.on('error', (err) => this.handleError(err));
    this.server.on('close', () => Log.error('Websocket', 'Server closed'));
  }

  private onUserConnected(ws: ISocket, token: string): void {
    this.validateUser(ws, token);

    ws.on('message', (message: string) => this.errorWrapper(() => this.handleUserMessage(message, ws)));
    ws.on('pong', () => this.errorWrapper(() => this.pong(ws)));
    ws.on('error', (error) => this.handleError(error));
    ws.on('close', () => this.userDisconnected(ws));
  }

  private validateUser(ws: ISocket, token: string): void {
    if (!token) return ws.close(1000, JSON.stringify(new errors.Unauthorized()));
    const prepared = token.split(' ')[1].trim();

    try {
      const { id, type } = jwt.verify(prepared, getConfig().accessToken) as {
        id: string;
        type: enums.EUserTypes;
      };
      ws.userId = id;
      this._users.push({ user: ws, userId: id, type });
    } catch (err) {
      ws.close(1000, JSON.stringify(new errors.Unauthorized()));
    }
  }

  private userDisconnected(ws: ISocket): void {
    this._users = this._users.filter((u) => {
      return u.userId !== ws.userId;
    });
  }

  private handleUserMessage(mess: string, ws: ISocket): void {
    let message: ISocketMessage = { payload: undefined, subTarget: undefined, target: undefined };

    try {
      message = JSON.parse(mess) as ISocketMessage;
    } catch (err) {
      return ws.send(JSON.stringify(new errors.IncorrectBodyType()));
    }

    switch (message.target) {
      case ESocketTargets.Messages:
        return this._router.handleMessage(message, ws);
      case undefined:
        return ws.send(JSON.stringify(new errors.IncorrectTarget()));
    }
  }

  private pong(ws: ISocket): void {
    ws.send('Pong');
  }

  private errorWrapper(callback: () => void): void {
    try {
      callback();
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: unknown): void {
    Log.error('Websocket', err);
  }
}
