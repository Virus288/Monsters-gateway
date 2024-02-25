import CreateFightDto from './dto';
import { ActionNotAllowed, ElementTooShortError } from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import GetProfileDto from '../../profile/get/dto';
import UserDetailsDto from '../../user/details/dto';
import type { ICreateFight, ICreateFightDto } from './types';
import type * as types from '../../../../types';
import type express from 'express';

export default class UserRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler, user, profile } = locals;

    const teams: ICreateFightDto = { teams: [[], []], attacker: profile?.user as string };
    const body = req.body as ICreateFight;

    if (!body.team || body.team.length === 0) {
      throw new ElementTooShortError('teams', 1);
    }
    if (body.team.includes(user?.login as string)) throw new ActionNotAllowed();

    const preparedNames = body.team.map((character) => {
      return new UserDetailsDto({ name: character });
    });
    const users = await reqHandler.user.getDetails(preparedNames, {
      userId: locals.userId,
      tempId: locals.tempId,
    });
    const profiles = await Promise.all(
      users.payload.map(async (u) => {
        return (
          await reqHandler.profile.get(new GetProfileDto(u._id), {
            userId: user?._id,
            tempId: (res.locals.tempId ?? '') as string,
          })
        ).payload;
      }),
    );

    profiles.forEach((p) => {
      teams.teams[1].push({
        userName: users.payload.find((u) => u._id === p.user)?._id as string,
        userId: p.user,
        lvl: p.lvl,
        exp: p.exp as [number, number],
        inventory: p.inventory,
      });
    });

    const data = new CreateFightDto(teams);
    await reqHandler.fights.createFight(data, {
      userId: locals.userId,
      tempId: locals.tempId,
    });
  }
}
