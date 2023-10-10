export interface IInventoryItem {
  itemId: string;
  quantity: number;
}

export interface IInventoryEntity {
  _id: string;
  userId: string;
  items: IInventoryItem[];
}
