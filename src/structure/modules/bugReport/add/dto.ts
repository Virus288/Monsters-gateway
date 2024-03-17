import Validation from '../../../../tools/validation';
import type { IAddBugReport } from './types';

export default class AddBugReport implements IAddBugReport {
  message: string;
  user: string;

  constructor(body: IAddBugReport, user: string) {
    this.message = body.message;
    this.user = user;

    this.validate();
  }

  validate(): void {
    new Validation(this.message, 'message').isDefined();
    new Validation(this.user, 'user').isDefined();
  }
}
