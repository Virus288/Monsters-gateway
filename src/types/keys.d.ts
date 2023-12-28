// eslint-disable-next-line @typescript-eslint/naming-convention
export interface JSONWebKey {
  kid?: string;
  x5c?: string[];
  alg?: string;
  crv?: string;
  d?: string;
  dp?: string;
  dq?: string;
  e?: string;
  ext?: boolean;
  k?: string;
  key_ops?: string[];
  kty?: string;
  n?: string;
  p?: string;
  q?: string;
  qi?: string;
  use?: string;
  x?: string;
  y?: string;
}

export interface ITokenPayload {
  jti: string;
  sub: number; // userId?
  iat: number;
  exp: number;
  scope: string;
  iss: string;
  aud: string;
}
