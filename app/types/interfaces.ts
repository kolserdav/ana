export enum MessageType {
  TEST = 'TEST',
}

export type Protocol = 'request';

export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { t: string }
  : never;

export interface SendMessageArgs<T extends keyof typeof MessageType> {
  type: T;
  id: number | string;
  data: ArgsSubset<T>;
}

export interface Message<T extends keyof typeof MessageType> {
  msg: SendMessageArgs<T>;
  protocol: Protocol;
}
