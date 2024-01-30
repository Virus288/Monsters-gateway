import GetMessagesDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import UserDetailsDto from '../../user/details/dto';
import type * as types from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async get(
    req: express.Request,
    res: express.Response,
  ): Promise<Record<string, types.IPreparedMessagesBody> | types.IFullMessageEntity[]> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    let data = new GetMessagesDto(Number(req.query.page));

    if (req.query.target) {
      data = new GetMessagesDto(Number(req.query.page), req.query.target as string);
    }

    const messages = (await reqHandler.message.get(data, locals)).payload;

    if (Array.isArray(messages)) {
      const userIds = messages.map((m) => (m.receiver === locals.userId ? m.sender : m.receiver));
      const cleaned = [...new Set(userIds), locals.userId].map((id) => new UserDetailsDto({ id }));
      const users = (await reqHandler.user.getDetails(cleaned, locals)).payload;
      return messages.map((m) => {
        return {
          ...m,
          receiver: users.find((e) => e._id === m.receiver)!.login,
          sender: users.find((e) => e._id === m.sender)!.login,
        };
      });
    }
    const userIds = Object.values(messages).map((m) => {
      return m.receiver === locals.userId ? m.sender : m.receiver;
    });
    const cleaned = [...new Set(userIds), locals.userId].map((id) => new UserDetailsDto({ id }));
    const users = (await reqHandler.user.getDetails(cleaned, locals)).payload;
    const prepared: Record<string, types.IPreparedMessagesBody> = {};
    Object.entries(messages).forEach(([k, v]) => {
      prepared[k] = {
        ...v,
        receiver: users.find((e) => e._id === v.receiver)!.login,
        sender: users.find((e) => e._id === v.sender)!.login,
      };
    });

    return prepared;
  }
}
