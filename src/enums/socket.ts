export enum ESocketTargets {
  Messages = 'messages',
  Chat = 'chat',
}

export enum EMessageSubTargets {
  Send = 'send',
  Get = 'get',
  Read = 'read',
  GetUnread = 'getUnread',
}

export enum ESocketType {
  Error = 'error',
  Message = 'message',
  Confirmation = 'confirmation',
}
