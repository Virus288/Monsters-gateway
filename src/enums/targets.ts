export enum EUserMainTargets {
  User = 'user',
  Party = 'party',
  Profile = 'profile',
  Inventory = 'inventory',
}

export enum EMessageMainTargets {
  Messages = 'messages',
  Chat = 'chat',
}

export enum EUserTargets {
  Register = 'register',
  Login = 'login',
  GetName = 'getName',
}

export enum EProfileTargets {
  Create = 'createProfile',
  Get = 'getProfile',
}

export enum EItemsTargets {
  Get = 'get',
  Use = 'use',
  Drop = 'drop',
}

export enum EPartyTargets {
  Get = 'get',
}

export enum ESharedTargets {
  RemoveUser = 'removeUser',
}
