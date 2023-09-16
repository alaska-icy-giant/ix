export interface Chapter {
  ctype?: string;
  ordernum: string;
  title: string;
}

export interface IObjectKeys<T> {
  [key: string]: T;
}
