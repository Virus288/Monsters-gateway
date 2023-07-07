import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import fakeData from '../../fakeData.json';
import Utils from '../../utils/utils';
import * as enums from '../../../src/enums';
import { EMessageSubTargets, ESocketType, EUserTypes } from '../../../src/enums';
import * as errors from '../../../src/errors';
import { IFullError, ISocketInMessage, ISocketOutMessage } from '../../../src/types';
import { IUserEntity } from '../../types';

describe('Socket - generic tests', () => {
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

    describe('No data passed', () => {
      it(`Target not provided`, async () => {
        const clone = structuredClone(message);
        clone.target = undefined!;

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.IncorrectTargetError();

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`SubTarget not provided`, async () => {
        const clone = structuredClone(message);
        clone.subTarget = undefined!;

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.IncorrectTargetError();

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`Payload not provided`, async () => {
        const clone = structuredClone(message);
        delete clone.payload;

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.MissingArgError('payload');

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`Payload - target not provided`, async () => {
        const clone = structuredClone(message);
        delete clone.payload.target;

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.MissingArgError('target');

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`Payload - message not provided`, async () => {
        const clone = structuredClone(message);
        delete clone.payload.message;

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.MissingArgError('message');

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`Target user does not exist`, async () => {
        const clone = structuredClone(message);
        clone.payload.target = 'a';

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { name } = payload as IFullError;
        const targetErr = new errors.IncorrectArgTypeError('receiver');

        expect(name).toEqual(targetErr.name);
      });
    });

    describe('Incorrect data', () => {
      it(`Message too long`, async () => {
        const clone = structuredClone(message);
        for (let x = 0; x < 1000; x++) {
          clone.payload.message += 'A';
        }

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { name } = payload as IFullError;
        const targetErr = new errors.IncorrectArgLengthError('body', 2, 1000);

        expect(name).toEqual(targetErr.name);
      });

      it(`Target id is not mongoose id`, async () => {
        const clone = structuredClone(message);
        clone.payload.target = 'a';

        await utils.sendMessage(clone);
        await utils.sleep(1500);
        const { payload } = utils.getLastMessage();
        const { name } = payload as IFullError;
        const targetErr = new errors.IncorrectArgTypeError('');

        expect(name).toEqual(targetErr.name);
      });
    });
  });

  describe('Should pass', () => {
    it(`Message sent`, async () => {
      const secondConnection = new Utils();
      await secondConnection.createSocketConnection(accessToken2);

      await utils.sendMessage(message);
      await utils.sleep(1500);
      const ms = secondConnection.getLastMessage();
      const { payload, type } = ms as ISocketOutMessage;

      expect(type).toEqual(ESocketType.Message.toString());
      expect(payload).toEqual(message.payload.message);

      await secondConnection.killSocket();
    });
  });
});
