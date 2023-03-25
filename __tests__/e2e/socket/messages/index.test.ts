import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import fakeData from '../../../fakeData.json';
import Utils from '../../../utils/utils';
import * as enums from '../../../../src/enums';
import { EMessageSubTargets, ESocketType, EUserTypes } from '../../../../src/enums';
import * as errors from '../../../../src/errors';
import { IFullError, ISocketInMessage, ISocketOutMessage } from '../../../../src/types';

describe('Socket', () => {
  const utils = new Utils();
  const fakeUser = fakeData.users[0];
  const fakeUser2 = fakeData.users[1];
  const accessToken = utils.generateAccessToken(fakeUser._id, EUserTypes.User);
  const accessToken2 = utils.generateAccessToken(fakeUser2._id, EUserTypes.User);
  const message: ISocketInMessage = {
    payload: { message: 'asd', target: fakeUser2._id },
    subTarget: EMessageSubTargets.SendMessage,
    target: enums.ESocketTargets.Messages,
  };

  describe('Should throw', () => {
    describe('Not logged in', () => {
      beforeAll(async () => {
        await utils.createSocketConnection();
      });

      afterAll(async () => {
        await utils.killSocket();
      });

      it(`User not logged in`, async () => {
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.UnauthorizedError();

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });
    });

    describe('No data passed', () => {
      beforeEach(async () => {
        await utils.createSocketConnection(accessToken);
      });

      afterEach(async () => {
        await utils.killSocket();
      });

      it(`Target not provided`, async () => {
        const clone = structuredClone(message);
        delete clone.target;

        await utils.sendMessage(clone);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.IncorrectTargetError();

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`SubTarget not provided`, async () => {
        const clone = structuredClone(message);
        delete clone.subTarget;

        await utils.sendMessage(clone);
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
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.MissingArgError('message');

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      // #TODO Add code in messages to properly fetch user's data.
      // it(`Targeted user does not exist`, async () => {
      //   const clone = structuredClone(message);
      //   clone.payload.target = 'a';
      //
      //   await utils.sendMessage(clone);
      //   const { payload } = utils.getLastMessage();
      //   const { code, name } = payload as IFullError;
      //   const targetErr = new errors.MissingArgError('message');
      //
      //   expect(code).toEqual(targetErr.code);
      //   expect(name).toEqual(targetErr.name);
      // });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
        await utils.createSocketConnection(accessToken);
      });

      afterEach(async () => {
        await utils.killSocket();
      });

      it(`Message too long`, async () => {
        const clone = structuredClone(message);
        clone.payload.message =
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

        await utils.sendMessage(clone);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.IncorrectArgError('Message length should ne exceed 200 characters');

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });

      it(`Target id is not mongoose id`, async () => {
        const clone = structuredClone(message);
        clone.payload.target = 'a';

        await utils.sendMessage(clone);
        const { payload } = utils.getLastMessage();
        const { code, name } = payload as IFullError;
        const targetErr = new errors.IncorrectArgError('Target is not valid mongoose id');

        expect(code).toEqual(targetErr.code);
        expect(name).toEqual(targetErr.name);
      });
    });
  });

  describe('Should pass', () => {
    beforeEach(async () => {
      await utils.createSocketConnection(accessToken);
    });

    afterEach(async () => {
      await utils.killSocket();
    });

    it(`Message sent`, async () => {
      const secondConnection = new Utils();
      await secondConnection.createSocketConnection(accessToken2);

      await utils.sendMessage(message);
      const ms = secondConnection.getLastMessage();
      const { payload, type } = ms as ISocketOutMessage;

      expect(type).toEqual(ESocketType.Message.toString());
      expect(payload).toEqual(message.payload.message);

      await secondConnection.killSocket();
    });
  });
});
