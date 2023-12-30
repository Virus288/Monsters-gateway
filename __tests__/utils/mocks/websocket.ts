import WebsocketServer from '../../../src/connections/websocket';
import Websocket from 'ws';
import * as errors from '../../../src/errors';
import type * as types from '../../../src/connections/websocket/types';

export default class SocketServer extends WebsocketServer {
  override get server(): Websocket.WebSocketServer {
    return this._server!;
  }

  override init(): void {
    this._server = new Websocket.Server({
      noServer: true,
    });
    this.startListeners();
  }

  override close(): void {
    this.server.close();

    this.users.forEach((u) => {
      u.clients.forEach((c) => {
        c.close(1000, JSON.stringify(new errors.InternalError()));
        this.userDisconnected(c);
      });
    });
  }

  override startListeners(): void {
    this.server.on('connection', (ws: types.ISocket, req) => {
      this.errorWrapper(() => this.onUserConnected(ws, req.headers.cookie, req.headers.authorization), ws);
    });
  }
}
