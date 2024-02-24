import jwt from 'jsonwebtoken';
import { JWK } from 'node-jose';
import State from '../../../../state';
import RouterFactory from '../../../../tools/abstracts/router';
import LoginDto from '../interaction/dto';
import type * as types from '../../../../types';
import type ReqHandler from '../../../reqHandler';
import type express from 'express';
import type { JSONWebKey } from 'jose';

export default class UserRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<{ token: string }> {
    const data = new LoginDto(req.body as LoginDto);
    const userData = await (res.locals.reqHandler as ReqHandler).user.login(data, res.locals as types.IUsersTokens);

    const privateKey = (await JWK.asKey(State.keys[0] as JSONWebKey)).toPEM(true);

    const payload = {
      sub: userData.payload.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 30,
    };
    const accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return { token: accessToken };
  }
}
