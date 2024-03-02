import CreateFightDto from './dto';
import { ECharacterState } from '../../../../enums';
import { ActionNotAllowed, ElementTooShortError, NoUserWithProvidedName } from '../../../../errors';
import RouterFactory from '../../../../tools/abstracts/router';
import ChangeCharacterStatusDto from '../../character/changeState/dto';
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

    if (users.payload.length !== body.team.length) {
      const dbUsers = users.payload.map((u) => u.login);
      const nonExistingUsers = body.team.filter((u) => !dbUsers.includes(u));
      throw new NoUserWithProvidedName(nonExistingUsers);
    }

    users.payload.forEach((u) => {
      teams.teams[1].push({
        character: u._id,
      });
    });

    const data = new CreateFightDto(teams);
    await reqHandler.fights.createFight(data, {
      userId: locals.userId,
      tempId: locals.tempId,
    });
    const characterState = new ChangeCharacterStatusDto({ state: ECharacterState.Fight });
    await reqHandler.characterState.changeState(characterState, {
      userId: locals.userId,
      tempId: locals.tempId,
    });
  }
}
