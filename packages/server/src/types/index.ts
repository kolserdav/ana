/* eslint-disable no-unused-vars */
import type { RequestGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import type { NextHandleFunction } from '@fastify/middie';
import { LocaleValue } from './interfaces';

export type RequestHandler<T extends RequestGenericInterface, R> = (
  req: FastifyRequest<T>,
  res: FastifyReply
) => Promise<R>;

export type MiddleHandler = NextHandleFunction;

export type Protocol = 'request' | 'ws' | 'orm';

export interface JWTFull {
  id: string;
  password: string;
  iat: number;
}

export type EmailType = 'restore-password' | 'confirm-email' | 'account-deleted';

export interface SendEmailParams<T extends EmailType> {
  type: T;
  locale: LocaleValue;
  email: string;
  subject: string;
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
    : T extends 'account-deleted'
    ? {
        name: string;
      }
    : never;
}
