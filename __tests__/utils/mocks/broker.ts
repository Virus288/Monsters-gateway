import Broker from '../../../src/connections/broker';
import type * as types from '../../../src/types/connection';
import * as enums from '../../../src/enums';
import { EMessageTypes } from '../../../src/enums';
import { IBrokerAction } from '../../types';

export default class FakeBroker extends Broker {
  private _actions: IBrokerAction[] = [];

  constructor() {
    super();
  }

  get actions(): IBrokerAction[] {
    return this._actions;
  }

  set actions(value: IBrokerAction[]) {
    this._actions = value;
  }

  override sendLocally<T extends types.IRabbitSubTargets>(
    _target: types.IRabbitTargets,
    _subTarget: T,
    resolve: (
      value:
        | { type: EMessageTypes.Credentials | EMessageTypes.Send; payload: unknown }
        | PromiseLike<{
            type: EMessageTypes.Credentials | EMessageTypes.Send;
            payload: unknown;
          }>,
    ) => void,
    reject: (reason?: unknown) => void,
    _locals: {
      tempId: string;
      userId: string | undefined;
      type: enums.EUserTypes;
    },
    _service: enums.EServices,
    _payload?: types.IRabbitConnectionData[T],
  ): void {
    const action = this.actions[0];
    if (!action) {
      this.actions = this.actions.slice(1, this.actions.length);
      return resolve({ type: EMessageTypes.Send, payload: {} });
    }

    if (action.shouldFail) {
      this.actions = this.actions.slice(1, this.actions.length);
      reject(action.returns.payload);
    } else {
      this.actions = this.actions.slice(1, this.actions.length);
      resolve({
        type: action.returns.target as EMessageTypes.Credentials | EMessageTypes.Send,
        payload: action.returns.payload,
      });
    }
  }
}
