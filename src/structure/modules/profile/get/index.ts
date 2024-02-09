import GetProfileDto from './dto';
import { NoUserWithProvidedName } from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import UserDetailsDto from '../../user/details/dto';
import type { IUsersTokens } from '../../../../types';
import type { IProfileEntity } from '../entity';
import type express from 'express';

export default class GetProfileRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<IProfileEntity> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const users = await reqHandler.user.getDetails([new UserDetailsDto({ id: req.query.id as string })], {
      userId: locals.userId,
      validated: locals.validated,
      tempId: locals.tempId,
    });

    if (!users || users.payload.length === 0) {
      throw new NoUserWithProvidedName();
    }
    const user = users.payload[0]!;
    const data = new GetProfileDto(user._id);

    return (
      await reqHandler.profile.get(data, {
        userId: locals.userId,
        validated: locals.validated,
        tempId: locals.tempId,
      })
    ).payload;
  }
}
