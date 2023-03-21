import type { ISocketMessage } from '../../types';
import type Websocket from 'ws';
import * as errors from '../../errors';

export default class Router {
  handleMessage(message: ISocketMessage, ws: Websocket.WebSocket): void {
    switch (message.subTarget) {
      case undefined:
        return ws.send(JSON.stringify(new errors.IncorrectTarget()));
    }
  }
}
