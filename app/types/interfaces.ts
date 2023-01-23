/* eslint-disable no-unused-vars */

export enum LogLevel {
  log = 0,
  info = 1,
  warn = 2,
  error = 3,
}

export enum MessageType {
  TEST = 'TEST',
  SET_CONNECTION_ID = 'SET_CONNECTION_ID',
  SET_ERROR = 'SET_ERROR',
}

export type Protocol = 'request';
export type WSProtocol = 'home';

export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { ok: 'yes' | 'no' }
  : T extends MessageType.SET_CONNECTION_ID
  ? null
  : never;

export interface SendMessageArgs<T extends keyof typeof MessageType> {
  type: T;
  id: string;
  data: ArgsSubset<T>;
}

export interface Message<T extends keyof typeof MessageType> {
  msg: SendMessageArgs<T>;
  protocol: Protocol;
}
