import Websocket from 'ws';
import Log from '../logger/log';
import getConfig from '../configLoader';

export default class WebsocketServer {
  private _server: Websocket.WebSocketServer;

  private get server(): Websocket.WebSocketServer {
    return this._server;
  }

  start(): void {
    this._server = new Websocket.Server({
      port: getConfig().socketPort,
    });
    this.startListeners();
  }

  close(): void {
    this.server.close();
  }

  startListeners(): void {
    this.server.on('connection', (ws) => {
      this.errorWrapper(() => this.onUserConnected(ws));
    });
    this.server.on('error', (err) => this.handleError(err));
    this.server.on('close', () => Log.error('Websocket', 'Server closed'));
  }

  private onUserConnected(ws: Websocket.WebSocket): void {
    Log.log('Websocket', 'User connected');
    ws.on('message', (message: string) => this.errorWrapper(() => this.handleUserMessage(message, ws)));
    ws.on('pong', () => this.errorWrapper(() => this.pong(ws)));
    ws.on('error', (error) => this.handleError(error));
    ws.on('close', () => Log.log('Websocket', 'User disconnected'));
  }

  private handleUserMessage(message: string, ws: Websocket.WebSocket): void {
    Log.log('Weboskcet', `New user message : ${message}`);
    ws.send('test');
  }

  private pong(ws: Websocket.WebSocket): void {
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
