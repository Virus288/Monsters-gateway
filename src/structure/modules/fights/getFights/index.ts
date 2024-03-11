import GetFightDto from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import UserDetailsDto from '../../user/details/dto';
import type * as types from '../../../../types';
import type { IUserEntity } from '../../user/entity';
import type { IActionEntity, IFight, IFightLogsEntity, IFightTeam } from '../entity';
import type express from 'express';

export default class FightRouter extends RouterFactory {
  async get(req: express.Request, res: express.Response): Promise<IFight[]> {
    const locals = res.locals as types.IUsersTokens;
    const { reqHandler } = locals;

    const data = new GetFightDto(
      {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        active: !!req.query.active,
      },
      locals.user?._id as string,
    );

    const { payload } = await reqHandler.fights.getFights(data, {
      userId: locals.userId,
      tempId: locals.tempId,
    });
    return this.prepareNames(payload, locals);
  }

  private async prepareNames(data: IFight[], locals: types.IUsersTokens): Promise<IFight[]> {
    return Promise.all(
      data.map(async (d) => {
        return {
          ...d,
          attacker: await this.findTarget(d.attacker, locals),
          states: {
            current: await this.prepareTeam(d.states.current, locals),
            initialized: await this.prepareTeam(d.states.initialized, locals),
          },
          log: await this.prepareLogs(d.log.logs, locals),
        };
      }),
    );
  }

  private async prepareTeam(
    data: {
      teams: IFightTeam[][];
    },
    locals: types.IUsersTokens,
  ): Promise<{ teams: IFightTeam[][] }> {
    const { reqHandler } = locals;
    const ids: string[] = data.teams
      .map((t) => {
        return t.map((team) => team.character);
      })
      .flat();

    const users = (
      await reqHandler.user.getDetails(
        ids.map((id) => new UserDetailsDto({ id })),
        {
          userId: locals.userId,
          tempId: locals.tempId,
        },
      )
    ).payload;

    // #TODO This code assumes that enemy will have existing profile ( will be another user ). This WILL NOT work for bots
    return {
      teams: data.teams.map((t) => {
        return t.map((body) => {
          return { ...body, character: users.find((u) => u._id === body.character)?.login as string };
        });
      }),
    };
  }

  private async prepareLogs(
    data: { phase: number; actions: IActionEntity[] }[],
    locals: types.IUsersTokens,
  ): Promise<IFightLogsEntity> {
    const { reqHandler } = locals;
    const ids: string[] = data
      .map((l) => {
        return l.actions
          .map((a) => {
            return [a.character, a.target];
          })
          .flat();
      })
      .flat();

    const users = (
      await reqHandler.user.getDetails(
        ids.map((id) => new UserDetailsDto({ id })),
        {
          userId: locals.userId,
          tempId: locals.tempId,
        },
      )
    ).payload;

    // #TODO This code assumes that enemy will have existing profile ( will be another user ). This WILL NOT work for bots
    return {
      logs: data.map((d) => {
        return {
          ...d,
          actions: d.actions.map((a) => {
            return {
              ...a,
              character: users.find((u) => u._id === a.character)?.login as string,
              target: users.find((u) => u._id === a.target)?.login as string,
            };
          }),
        };
      }),
    };
  }

  private async findTarget(target: string, locals: types.IUsersTokens): Promise<string> {
    const { reqHandler } = locals;

    return (
      (
        await reqHandler.user.getDetails([new UserDetailsDto({ id: target })], {
          userId: locals.userId,
          tempId: locals.tempId,
        })
      ).payload[0] as IUserEntity
    ).login;
  }
}
