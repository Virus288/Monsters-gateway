import BugReport from './modules/bugReport/handler';
import CharacterState from './modules/character/handler';
import Chat from './modules/chat/handler';
import Fights from './modules/fights/handler';
import Inventory from './modules/inventory/handler';
import Log from './modules/logs/handler';
import Message from './modules/message/handler';
import Party from './modules/party/handler';
import Profile from './modules/profile/handler';
import User from './modules/user/handler';
import { EServices } from '../enums';
import State from '../state';
import type * as enums from '../enums';
import type * as types from '../types';

/**
 * Handler to manage communication between services and user
 */
export default class ReqHandler {
  log: Log;
  user: User;
  chat: Chat;
  party: Party;
  fights: Fights;
  profile: Profile;
  message: Message;
  inventory: Inventory;
  bugReport: BugReport;
  characterState: CharacterState;

  constructor() {
    const action = <T extends types.IRabbitSubTargets>(
      service: EServices,
      mainTarget: types.IRabbitTargets,
      subTarget: T,
      userData: types.IUserBrokerInfo,
      data?: types.IRabbitConnectionData[T],
    ): Promise<{
      type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
      payload: unknown;
    }> => this.send(service, mainTarget, subTarget, userData, data);

    this.log = new Log(EServices.Users, action);
    this.user = new User(EServices.Users, action);
    this.party = new Party(EServices.Users, action);
    this.chat = new Chat(EServices.Messages, action);
    this.fights = new Fights(EServices.Fights, action);
    this.profile = new Profile(EServices.Users, action);
    this.message = new Message(EServices.Messages, action);
    this.inventory = new Inventory(EServices.Users, action);
    this.bugReport = new BugReport(EServices.Users, action);
    this.characterState = new CharacterState(EServices.Users, action);
  }

  private async send<T extends types.IRabbitSubTargets>(
    service: EServices,
    mainTarget: types.IRabbitTargets,
    subTarget: T,
    userData: types.IUserBrokerInfo,
    data?: types.IRabbitConnectionData[T],
  ): Promise<{
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
    payload: unknown;
  }> {
    return new Promise((resolve, reject) => {
      State.broker.sendLocally(mainTarget, subTarget, resolve, reject, userData, service, data);
    });
  }
}
