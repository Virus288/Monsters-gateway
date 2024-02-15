export enum EUserMainTargets {
  Log = 'log',
  User = 'user',
  Chat = 'chat',
  Party = 'party',
  Profile = 'profile',
  Message = 'message',
  Inventory = 'inventory',
}

export enum EUserTargets {
  Register = 'register',
  Login = 'login',
  GetName = 'getName',
  Remove = 'removeUser',
  DebugGetAll = 'debugGetAll',
}

export enum EProfileTargets {
  Create = 'createProfile',
  Get = 'getProfile',
}

export enum EItemsTargets {
  Get = 'getItem',
  Use = 'useItem',
  Drop = 'dropItem',
}

export enum EMessagesTargets {
  Send = 'send',
  Get = 'get',
  Read = 'read',
  GetUnread = 'getUnread',
}

export enum EChatTargets {
  Send = 'sendChatMessage',
  Get = 'getChatMessage',
  Read = 'readChatMessage',
  GetUnread = 'getUnreadChatMessages',
}

export enum EPartyTargets {
  Get = 'getParty',
}
