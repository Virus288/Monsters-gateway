import type * as enums from '../../enums';
import type * as types from '../../types';

export default abstract class ReqHandler {
  private readonly _sendReq: <T extends types.IRabbitSubTargets>(
    service: enums.EServices,
    mainTarget: types.IRabbitTargets,
    subTarget: T,
    userData: types.IUserBrokerInfo,
    data?: types.IRabbitConnectionData[T],
  ) => Promise<{
    type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
    payload: unknown;
  }>;
  private readonly _service: enums.EServices;

  constructor(
    service: enums.EServices,
    sendReq: <T extends types.IRabbitSubTargets>(
      service: enums.EServices,
      mainTarget: types.IRabbitTargets,
      subTarget: T,
      userData: types.IUserBrokerInfo,
      data?: types.IRabbitConnectionData[T],
    ) => Promise<{
      type: enums.EMessageTypes.Credentials | enums.EMessageTypes.Send;
      payload: unknown;
    }>,
  ) {
    this._sendReq = sendReq;
    this._service = service;
  }

  protected get sendReq(): <T extends types.IRabbitSubTargets>(
    service: enums.EServices,
    mainTarget: types.IRabbitTargets,
    subTarget: T,
    userData: types.IUserBrokerInfo,
    data?: types.IRabbitConnectionData[T],
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
