import * as enums from '../../../enums';
import ReqHandler from '../../../tools/abstracts/reqHandler';
import type AddBugReport from './add/dto';
import type { IUserBrokerInfo } from '../../../types';

export default class Message extends ReqHandler {
  async add(data: AddBugReport, userData: IUserBrokerInfo): Promise<void> {
    await this.sendReq(
      this.service,
      enums.EUserMainTargets.BugReport,
      enums.EBugReportTargets.AddBugReport,
      userData,
      data,
    );
  }
}
