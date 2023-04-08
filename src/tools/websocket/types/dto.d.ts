export interface ISendMessageDto {
  body: string;
  receiver: string;
  sender: string;
}

export interface IGetMessageDto {
  page: number;
  target?: string;
}

export interface IReadMessageDto {
  id: string;
  user: string;
}
