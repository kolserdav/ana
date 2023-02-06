/* eslint-disable no-unused-vars */
import type { RequestGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import { LocaleValue, MessageType, SendMessageArgs } from './interfaces';

export type RequestHandler<T extends RequestGenericInterface, R> = (
  req: FastifyRequest<T>,
  res: FastifyReply
) => Promise<R>;

export type Protocol = 'request' | 'ws' | 'orm';

export interface ProcessMessage<T extends keyof typeof MessageType> {
  msg: SendMessageArgs<T>;
  protocol: Protocol;
}

export interface JWTFull {
  id: string;
  iat: number;
}

export type EmailType = 'restore-password' | 'confirm-email';

export interface SendEmailParams<T extends EmailType> {
  type: T;
  locale: LocaleValue;
  email: string;
  data: T extends 'restore-password'
    ? {
        name: string;
        link: string;
        expire: number;
      }
    : T extends 'confirm-email'
    ? {
        name: string;
        link: string;
      }
    : never;
}
