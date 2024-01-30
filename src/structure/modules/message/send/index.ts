import InventoryDropDto from './dto';
import { NoUserWithProvidedName } from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import UserDetailsDto from '../../user/details/dto';
import type { ISendMessageDto } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class MessagesRouter extends RouterFactory {
  async put(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const user = await reqHandler.user.getDetails(
      [new UserDetailsDto({ name: (req.body as ISendMessageDto).receiver })],
      locals,
    );
    if (!user.payload || user.payload.length === 0) {
      throw new NoUserWithProvidedName();
    }

    const data = new InventoryDropDto(
      {
        ...req.body,
        receiver: user.payload[0]!._id,
      } as ISendMessageDto,
      locals.userId!,
    );
    await reqHandler.message.send(data, locals);
  }
}
