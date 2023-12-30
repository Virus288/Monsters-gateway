export enum EUserMainTargets {
  User = 'user',
  Chat = 'chat',
  Party = 'party',
  Profile = 'profile',
  Messages = 'messages',
  Inventory = 'inventory',
}

export enum EUserTargets {
  Register = 'register',
  Login = 'login',
  GetName = 'getName',
  Remove = 'removeUser',
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

export enum EMessageTargets {
  Send = 'sendMessage',
  Get = 'getMessage',
  Read = 'readMessage',
  GetUnread = 'getUnreadMessages',
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
