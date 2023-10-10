import type * as enums from '../../enums';
import type { IRabbitConnectionData, IRabbitSubTargets, IRabbitTargets } from '../../types';

export default abstract class ReqHandler {
  private readonly _sendReq: <T extends IRabbitSubTargets>(
    service: enums.EServices,
    mainTarget: IRabbitTargets,
    subTarget: T,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
    data?: IRabbitConnectionData[T],
  ) => Promise<{
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
    payload: unknown;
  }>;
  private readonly _service: enums.EServices;

  constructor(
    service: enums.EServices,
    sendReq: <T extends IRabbitSubTargets>(
      service: enums.EServices,
      mainTarget: IRabbitTargets,
      subTarget: T,
      locals: {
        tempId: string;
        userId: string | undefined;
        validated: boolean;
        type: enums.EUserTypes;
      },
      data?: IRabbitConnectionData[T],
    ) => Promise<{
      type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
      payload: unknown;
    }>,
  ) {
    this._sendReq = sendReq;
    this._service = service;
  }

  protected get sendReq(): <T extends IRabbitSubTargets>(
    service: enums.EServices,
    mainTarget: IRabbitTargets,
    subTarget: T,
    locals: {
      tempId: string;
      userId: string | undefined;
      validated: boolean;
      type: enums.EUserTypes;
    },
    data?: IRabbitConnectionData[T],
  ) => Promise<{
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
    payload: unknown;
  }> {
    return this._sendReq;
  }

  protected get service(): enums.EServices {
    return this._service;
  }
}
