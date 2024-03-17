import BugReport from './dto';
import RouterFactory from '../../../../tools/abstracts/router';
import type { IAddBugReport } from './types';
import type { IUsersTokens } from '../../../../types';
import type express from 'express';

export default class BugReportRouter extends RouterFactory {
  async post(req: express.Request, res: express.Response): Promise<void> {
    const locals = res.locals as IUsersTokens;
    const { reqHandler } = locals;

    const data = new BugReport(req.body as IAddBugReport, locals.userId!);

    await reqHandler.bugReport.add(data, { userId: locals.userId, tempId: locals.tempId });
  }
}
