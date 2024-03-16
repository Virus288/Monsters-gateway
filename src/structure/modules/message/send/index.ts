import SendMessagesDto from './dto';
import { ESocketType } from '../../../../enums';
import { NoUserWithProvidedName } from '../../../../errors';
import State from '../../../../state';
import RouterFactory from '../../../../tools/abstracts/router';
import UserDetailsDto from '../../user/details/dto';
import type { ISendMessageDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new SendMessagesDto(
      {
        ...req.body,
      } as ISendMessageDto,
      locals.userId!,
    );

    const users = await reqHandler.user.getDetails(
      [new UserDetailsDto({ name: (req.body as ISendMessageDto).receiver }), new UserDetailsDto({ id: locals.userId })],
      { userId: locals.userId, tempId: locals.tempId },
    );
    if (!users || users.payload.length === 0) {
      throw new NoUserWithProvidedName();
    }
    const receiver = users.payload.find((u) => u.login === data.receiver);
    const sender = users.payload.find((u) => u._id === data.sender);
    if (!receiver) {
      throw new NoUserWithProvidedName();
    }

    await reqHandler.message.send(
      new SendMessagesDto(
        {
          ...data,
          receiver: receiver?._id,
        },
        locals.userId!,
      ),
      { userId: locals.userId, tempId: locals.tempId },
    );
    State.socket.sendToUser(
      receiver._id,
      { body: data.body, sender: sender?.login, receiver: sender?.login },
      ESocketType.Message,
    );
  }
}
