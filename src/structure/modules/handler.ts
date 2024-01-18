import Chat from './chat/handler';
import Inventory from './inventory/handler';
import Message from './message/handler';
import Party from './party/handler';
import Profile from './profile/handler';
import User from './user/handler';
import { EServices } from '../../enums';
import State from '../../state';
import type * as enums from '../../enums';
import type * as types from '../../types';

/**
 * Handler to manage communication between services and user
 */
export default class ReqHandler {
  user: User;
  chat: Chat;
  party: Party;
  profile: Profile;
  message: Message;
  inventory: Inventory;

  constructor() {
    const action = <T extends types.IRabbitSubTargets>(
      service: EServices,
      mainTarget: types.IRabbitTargets,
      subTarget: T,
      locals: {
        tempId: string;
        userId: string | undefined;
        validated: boolean;
        type: enums.EUserTypes;
      },
      data?: types.IRabbitConnectionData[T],
    ): Promise<{
      type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
      payload: unknown;
    }> => this.send(service, mainTarget, subTarget, locals, data);

    this.user = new User(EServices.Users, action);
    this.chat = new Chat(EServices.Messages, action);
    this.party = new Party(EServices.Users, action);
    this.profile = new Profile(EServices.Users, action);
    this.message = new Message(EServices.Messages, action);
    this.inventory = new Inventory(EServices.Users, action);
  }

  private async send<T extends types.IRabbitSubTargets>(
    service: EServices,
    mainTarget: types.IRabbitTargets,
    subTarget: T,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
    data?: types.IRabbitConnectionData[T],
  ): Promise<{
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
    payload: unknown;
  }> {
    return new Promise((resolve, reject) => {
      State.broker.sendLocally(mainTarget, subTarget, resolve, reject, locals, service, data);
    });
  }
}
