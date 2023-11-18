import Chat from './chat';
import Inventory from './inventory';
import Message from './message';
import Party from './party';
import Profile from './profile';
import User from './user';
import { EServices } from '../../enums';
import State from '../../tools/state';
import type * as enums from '../../enums';
import type { IRabbitConnectionData, IRabbitSubTargets, IRabbitTargets } from '../../types';

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
    const func = <T extends IRabbitSubTargets>(
      service: EServices,
      mainTarget: IRabbitTargets,
      subTarget: T,
      locals: {
        tempId: string;
        userId: string | undefined;
        validated: boolean;
        type: enums.EUserTypes;
      },
      data?: IRabbitConnectionData[T],
    ): Promise<{
      type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
      payload: unknown;
    }> => this.send(service, mainTarget, subTarget, locals, data);

    this.user = new User(EServices.Users, func);
    this.chat = new Chat(EServices.Messages, func);
    this.party = new Party(EServices.Users, func);
    this.profile = new Profile(EServices.Users, func);
    this.message = new Message(EServices.Messages, func);
    this.inventory = new Inventory(EServices.Users, func);
  }

  private async send<T extends IRabbitSubTargets>(
    service: EServices,
    mainTarget: IRabbitTargets,
    subTarget: T,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
    data?: IRabbitConnectionData[T],
  ): Promise<{
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
    payload: unknown;
  }> {
    return new Promise((resolve, reject) => {
      State.broker.sendLocally(mainTarget, subTarget, resolve, reject, locals, service, data);
    });
  }
}
