import type { JSONWebKey } from 'jose';

export interface ITokenPayload {
  jti: string;
  sub: string;
  iat: number;
  exp: number;
  scope: string;
  iss: string;
  aud: string;
}

export interface ILoginKeys {
  id: number;
  expiration: Date;
  key: JSONWebKey;
}
