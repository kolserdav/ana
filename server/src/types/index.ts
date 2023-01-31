/* eslint-disable no-unused-vars */
import { PrismaClient, Prisma } from '@prisma/client';
import type { RequestGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import { IncomingHttpHeaders } from 'http';

export type DatabaseContext = {
  headers: IncomingHttpHeaders;
};

export type RequestHandler<T extends RequestGenericInterface, R> = (
  req: FastifyRequest<T>,
  res: FastifyReply
) => Promise<R>;

export enum ProcessMessage {
  DB_COMMAND = 'DB_COMMAND',
  DB_RESULT = 'DB_RESULT',
}

export type Protocol = 'request' | 'ws' | 'orm';

export type ArgsProcessSubset<T extends keyof typeof ProcessMessage> =
  T extends ProcessMessage.DB_COMMAND
    ? {
        model: keyof PrismaClient;
        command: Prisma.PrismaAction;
        args: Prisma.SelectSubset<any, any>;
      }
    : T extends ProcessMessage.DB_RESULT
    ? any
    : never;

export interface Message<T extends keyof typeof ProcessMessage> {
  msg: SendProcessMessageArgs<T>;
  protocol: Protocol;
  context: DatabaseContext;
}
export interface SendProcessMessageArgs<T extends keyof typeof ProcessMessage> {
  type: keyof typeof ProcessMessage;
  id: string;
  data: ArgsProcessSubset<T>;
}

export interface JWTFull {
  id: string;
  iat: number;
}
