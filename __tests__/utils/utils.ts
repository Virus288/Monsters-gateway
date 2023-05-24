import jwt from 'jsonwebtoken';
import getConfig from '../../src/tools/configLoader';
import * as types from '../../src/enums';
import * as enums from '../../src/enums';
import Websocket from 'ws';
import { ISocketInMessage, ISocketOutMessage } from '../../src/types';

export default class Utils {
  socket: Websocket | undefined = undefined;

  private _messages: ISocketOutMessage[] = [];

  private get messages(): ISocketOutMessage[] {
    return this._messages;
  }

  generateAccessToken = (id: string, type: types.EUserTypes): string => {
    return jwt.sign({ id, type }, getConfig().accessToken, {
      expiresIn: enums.jwtTime.TokenMaxAge,
    });
  };

  generateRefreshToken = (id: string, type: types.EUserTypes): string => {
    return jwt.sign({ id, type }, getConfig().refToken, {
      expiresIn: enums.jwtTime.RefreshTokenMaxAge,
    });
  };

  async createSocketConnection(token?: string): Promise<void> {
    return new Promise((resolve) => {
      this.socket = new Websocket(`ws://localhost:${getConfig().socketPort}/ws`, {
        headers: token === undefined ? {} : { Authorization: `Bearer: ${token}` },
      });
      this.socket.on('open', () => {
        setTimeout(() => resolve(), 3000);
      });
      this.socket.on('message', (m: string) => {
        this.messages.push(JSON.parse(m) as ISocketOutMessage);
      });
      this.socket.on('close', (_code, mess) => {
        try {
          this.messages.push(JSON.parse(mess.toString()));
        } catch (err) {}
      });
    });
  }

  async killSocket(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket) this.socket.close();
      setTimeout(() => resolve(), 1000);
    });
  }

  async sendMessage(message: ISocketInMessage): Promise<void> {
    this.socket!.send(JSON.stringify(message));
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  }

  getLastMessage(): ISocketOutMessage {
    const lastMess = this.messages[this._messages.length - 1];
    this._messages.pop();
    return lastMess!;
  }
}
