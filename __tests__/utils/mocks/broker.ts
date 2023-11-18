import Broker from '../../../src/broker';
import type * as types from '../../../src/types/connection';
import * as enums from '../../../src/enums';
import { EMessageTypes } from '../../../src/enums';
import { IBrokerAction } from '../../types';

export default class FakeBroker extends Broker {
  private _action: IBrokerAction | undefined;

  constructor() {
    super();
  }

  get action(): IBrokerAction | undefined {
    return this._action;
  }

  set action(value: IBrokerAction | undefined) {
    this._action = value;
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
      validated: boolean;
      type: enums.EUserTypes;
    },
    _service: enums.EServices,
    _payload?: types.IRabbitConnectionData[T],
  ): void {
    const action = this.action;
    if (!action) return resolve({ type: EMessageTypes.Send, payload: {} });

    if (action.shouldFail) {
      reject(action.returns.payload);
    } else {
      resolve({
        type: action.returns.target as EMessageTypes.Credentials | EMessageTypes.Send,
        payload: action.returns.payload,
      });
    }
  }
}
