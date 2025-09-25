export interface ResponseListBase<T> {
  code: number;
  status: string;
  items: T;
}

export interface ResponseItemBase<T> {
  code: number;
  status: string;
  item: T;
}
