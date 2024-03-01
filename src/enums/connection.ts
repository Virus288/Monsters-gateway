export enum EMessageTypes {
  Error = 'error',
  Credentials = 'credentials',
  Send = 'send',
  Heartbeat = 'heartbeat',
}

export enum ERabbit {
  RetryLimit = 10,
}

export enum EServices {
  Fights = 'fights',
  Gateway = 'gateway',
  Users = 'users',
  Messages = 'messages',
}

export enum EAmqQueues {
  Fights = 'fightsQueue',
  Gateway = 'gatewayQueue',
  Users = 'usersQueue',
  Messages = 'messagesQueue',
}

export enum EConnectionType {
  Api = 'api',
  Socket = 'socket',
}
