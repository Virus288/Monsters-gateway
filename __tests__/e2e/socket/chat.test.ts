import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import fakeData from '../../fakeData.json';
import Utils from '../../utils/utils';
import * as enums from '../../../src/enums';
import { EMessageSubTargets, ESocketType, EUserTypes } from '../../../src/enums';
import * as errors from '../../../src/errors';
import { IFullError } from '../../../src/types';
import { IFullMessageEntity, IUserEntity } from '../../types';
import { ISocketInMessage } from '../../../src/tools/websocket/types';

describe('Socket - chat', () => {
  const utils = new Utils();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
  const accessToken2 = utils.generateAccessToken(fakeUser2._id, EUserTypes.User);
  const message: ISocketInMessage = {
    payload: { message: 'asd', target: fakeUser2._id },
    subTarget: EMessageSubTargets.Send,
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

  beforeAll(async () => await utils.createSocketConnection(accessToken));
  afterAll(async () => await utils.killSocket());

  describe('Should throw', () => {
    describe('Not logged in', () => {
      const utils2 = new Utils();

      it(`User not logged in`, async () => {
        await utils2.createSocketConnection();
        const { payload } = utils2.getLastMessage();

        const { code, name } = payload as IFullError;
        const targetErr = new errors.UnauthorizedError();
        await utils2.killSocket();

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });
    });
  });

  describe('Should pass', () => {
    it(`No messages`, async () => {
      const secondConnection = new Utils();
      await secondConnection.createSocketConnection(accessToken2);
      await secondConnection.killSocket();

      await utils.sendMessage(message);
      const data = secondConnection.getLastMessage();

      expect(data).toEqual(undefined);
    });

    it(`Get message from db`, async () => {
      await utils.sendMessage(message);

      const secondConnection = new Utils();
      await secondConnection.createSocketConnection(accessToken2);

      await secondConnection.sendMessage(getMessage);
      await utils.sleep(1500);
      const userMessage = secondConnection.getLastMessage();
      await secondConnection.killSocket();

      expect(Object.keys((userMessage?.payload as Record<string, string>) ?? {}).length).toBeGreaterThan(0);
    });

    it(`Read chat`, async () => {
      await utils.sendMessage(message);

      const secondConnection = new Utils();
      await secondConnection.createSocketConnection(accessToken2);

      await secondConnection.sendMessage(getMessage);
      await utils.sleep(1500);
      const userMessage = secondConnection.getLastMessage();

      await secondConnection.sendMessage({
        ...readMessage,
        payload: {
          chatId: Object.keys((userMessage?.payload as Record<string, string>) ?? {})[0],
          user: fakeUser2._id,
        },
      });
      await utils.sleep(1500);

      const userMessage2 = secondConnection.getLastMessage();

      expect(userMessage2?.type).toEqual(ESocketType.Confirmation);

      await secondConnection.sendMessage(getUnread);
      await utils.sleep(1500);
      const userMessage3 = secondConnection.getLastMessage();

      expect(Object.keys(userMessage3?.payload as Record<string, string>).length).toEqual(0);
      await secondConnection.killSocket();
    });

    it(`Get with details`, async () => {
      await utils.sendMessage(message);

      const secondConnection = new Utils();
      await secondConnection.createSocketConnection(accessToken2);

      await secondConnection.sendMessage(getMessage);
      await utils.sleep(1500);
      const userMessage = secondConnection.getLastMessage();

      expect(Object.keys((userMessage?.payload as Record<string, string>) ?? {}).length).toBeGreaterThan(0);

      await secondConnection.sendMessage({
        ...getWithDetails,
        payload: { ...getWithDetails.payload, target: Object.keys(userMessage.payload as Record<string, string>)[0] },
      });
      await utils.sleep(1500);
      const userMessage2 = secondConnection.getLastMessage();
      await utils.sleep(1500);
      const payload = userMessage2?.payload as IFullMessageEntity[];

      expect(payload.length).toBeGreaterThan(0);
      await secondConnection.killSocket();
    });
  });
});
