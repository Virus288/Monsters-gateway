import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import State from '../../../src/state';
import SocketServer from '../../utils/mocks/websocket';
import * as enums from '../../../src/enums';
import { EMessageSubTargets, EMessageTypes } from '../../../src/enums';
import { ESocketType } from '../../../src/enums';
import fakeData from '../../fakeData.json';
import { ISocketInMessage, ISocketOutMessage } from '../../../src/connections/websocket/types';
import { FakeBroker } from '../../utils/mocks';
import { IUserEntity } from '../../../src/types';
import { IFullError } from '../../../src/types';
import type { IClient } from 'moc-socket';
import MocSocket from 'moc-socket';
import { getKeys } from '../../../src/oidc/utils';
import * as jose from 'node-jose';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../src/errors';
import Utils from '../../utils/utils';
import { IFullMessageEntity } from '../../../src/structure/modules/message/get/types';

describe('Socket - chat', () => {
  const fakeBroker = State.broker as FakeBroker;
  const utils = new Utils();
  let server: MocSocket;
  let client: IClient;
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  let clientOptions: Record<string, unknown>;
  let client2Options: Record<string, unknown>;
  const message: ISocketInMessage = {
    payload: { message: 'asd', target: fakeUser2._id },
    subTarget: enums.EMessageSubTargets.Send,
    target: enums.ESocketTargets.Chat,
  };
  const baseMessage: ISocketInMessage = {
    payload: { page: 1 },
    subTarget: EMessageSubTargets.Get,
    target: enums.ESocketTargets.Chat,
  };
  const getMessage = {
    ...baseMessage,
  };
  const getUnread = {
    ...baseMessage,
    subTarget: EMessageSubTargets.GetUnread,
  };
  const readMessage = {
    ...baseMessage,
    subTarget: EMessageSubTargets.Read,
  };
  const getWithDetails = {
    ...baseMessage,
    subTarget: EMessageSubTargets.Get,
  };

  beforeAll(async () => {
    State.keys = await getKeys(1);
    const privateKey = (await jose.JWK.asKey(State.keys[0]!)).toPEM(true);

    const payload = {
      sub: fakeUser._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const payload2 = {
      sub: fakeUser2._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const loginToken1 = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    const loginToken2 = jwt.sign(payload2, privateKey, { algorithm: 'RS256' });

    clientOptions = {
      headers: { Authorization: `Bearer ${loginToken1}` },
    };
    client2Options = {
      headers: { Authorization: `Bearer ${loginToken2}` },
    };

    server = new MocSocket((State.socket as SocketServer).server);
    client = server.createClient();

    await client.connect(clientOptions);
  });

  afterAll(() => {
    client.disconnect();
    State.keys = [];
  });

  describe('Should throw', () => {
    describe('Not logged in', () => {
      let client2: IClient;

      beforeAll(() => {
        client2 = server.createClient();
      });

      it(`User not logged in`, async () => {
        await client2.connect();
        const target = new UnauthorizedError();

        await utils.sleep(200);
        const [message] = client2.getLastMessages() as ISocketOutMessage[];
        const { name } = message?.payload as IFullError;
        client2.disconnect();

        expect(name).toEqual(target.name);
      });
    });
  });

  describe('Should pass', () => {
    let client2: IClient;

    beforeAll(async () => (client2 = server.createClient()));

    afterEach(async () => client2.disconnect());

    it(`No messages`, async () => {
      await client2.connect();
      const data = await client2.sendAsyncMessage(message, { timeout: 100 });
      expect(data).toEqual(undefined);
      client2.disconnect();
    });

    it(`Get message from db`, async () => {
      console.log('message');
      console.log(message);
      fakeBroker.action = {
        shouldFail: false,
        returns: {
          payload: {
            a: [
              {
                sender: fakeUser._id,
                receiver: fakeUser2._id,
                messages: 1,
              },
            ],
          },
          target: EMessageTypes.Send,
        },
      };
      await client2.connect(client2Options);
      const userMessage = (await client2.sendAsyncMessage(getMessage)) as ISocketOutMessage;
      console.log('userMessage');
      console.log(userMessage);

      expect(Object.keys((userMessage?.payload as Record<string, string>) ?? {}).length).toBeGreaterThan(0);
      client2.disconnect();
    });

    it(`Read chat`, async () => {
      fakeBroker.action = {
        shouldFail: false,
        returns: {
          payload: {
            a: [
              {
                sender: fakeUser._id,
                receiver: fakeUser2._id,
                messages: 1,
              },
            ],
          },
          target: EMessageTypes.Send,
        },
      };

      await client2.connect(client2Options);
      const userMessage = (await client2.sendAsyncMessage(getMessage, { timeout: 100 })) as ISocketOutMessage;

      fakeBroker.action = {
        shouldFail: false,
        returns: {
          payload: {
            id1: [
              {
                sender: fakeUser._id,
                receiver: fakeUser2._id,
                messages: 1,
              },
            ],
          },
          target: EMessageTypes.Send,
        },
      };

      const userMessage2 = (await client2.sendAsyncMessage(
        {
          ...readMessage,
          payload: {
            chatId: Object.keys((userMessage?.payload as Record<string, string>) ?? {})[0],
            user: fakeUser2._id,
          },
        },
        { timeout: 100 },
      )) as ISocketOutMessage;
      expect(userMessage2?.type).toEqual(ESocketType.Success);

      fakeBroker.action = {
        shouldFail: false,
        returns: {
          payload: {},
          target: EMessageTypes.Send,
        },
      };

      const userMessage3 = (await client2.sendAsyncMessage(getUnread, { timeout: 100 })) as ISocketOutMessage;
      expect(Object.keys(userMessage3?.payload as Record<string, string>).length).toEqual(0);
      client2.disconnect();
    });

    it(`Get with details`, async () => {
      fakeBroker.action = {
        shouldFail: false,
        returns: {
          payload: {
            id1: [
              {
                sender: fakeUser._id,
                receiver: fakeUser2._id,
                messages: 1,
              },
            ],
          },
          target: EMessageTypes.Send,
        },
      };

      await client2.connect(client2Options);

      const userMessage = (await client2.sendAsyncMessage(getMessage, { timeout: 100 })) as ISocketOutMessage;
      expect(Object.keys((userMessage?.payload as Record<string, string>) ?? {}).length).toBeGreaterThan(0);

      fakeBroker.action = {
        shouldFail: false,
        returns: {
          payload: [
            {
              sender: fakeUser._id,
              receiver: fakeUser2._id,
              read: true,
              chatId: 'id1',
              message: 'banana',
            },
          ],
          target: EMessageTypes.Send,
        },
      };

      const userMessage2 = (await client2.sendAsyncMessage({
        ...getWithDetails,
        payload: { ...getWithDetails.payload, target: Object.keys(userMessage.payload as Record<string, string>)[0] },
      })) as ISocketOutMessage;
      const payload = userMessage2?.payload as IFullMessageEntity[];

      expect(payload.length).toBeGreaterThan(0);
      client2.disconnect();
    });
  });
});
