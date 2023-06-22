/* eslint-disable no-unused-vars */
import type { RequestGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import type { NextHandleFunction } from '@fastify/middie';
import { LocaleValue } from './interfaces';
import { Prisma, PrismaClient } from '@prisma/client';

export type RequestHandler<T extends RequestGenericInterface, R> = (
  req: FastifyRequest<T>,
  res: FastifyReply
) => Promise<R>;

export type PrismaCommand = Prisma.PrismaAction | 'groupBy' | '$queryRawUnsafe';
export interface DBCommandProps {
  model: keyof PrismaClient;
  values?: string[];
  command: PrismaCommand;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: Prisma.SelectSubset<any, any>;
}

export type MiddleHandler = NextHandleFunction;

export type Protocol = 'request' | 'ws' | 'orm';

export interface JWTFull {
  id: string;
  password: string;
  iat: number;
}

export type EmailType =
  | 'restore-password'
  | 'confirm-email'
  | 'account-deleted'
  | 'admin-message'
  | 'admin-support';

export interface SendEmailParams<T extends EmailType> {
  type: T;
  locale: LocaleValue;
  email: string;
  subject: string;
  from?: string;
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
    : T extends 'admin-message'
    ? {
        message: string;
      }
    : T extends 'admin-support'
    ? {
        message: string;
        date: string;
        email: string;
        name: string;
      }
    : never;
}

/**
 * Deps with scripts/server-messages.js ArgName
 */
export type ScriptServerMessagesArgName = 'reboot-create' | 'reboot-delete' | 'unavailable-create';
