import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const REDIS_PASS = process.env.REDIS_PASS as string;
export const AMQP_ADDRESS = process.env.AMQP_ADDRESS as string;
export const APP_URL = process.env.APP_URL as string;
export const PORT = parseInt(process.env.PORT as string, 10);
export const WS_PORT = parseInt(process.env.WS_PORT as string, 10);
export const LOG_LEVEL = parseInt(process.env.LOG_LEVEL as string, 10);
export const IS_DEV = process.env.NODE_ENV === 'development';
export const FASTIFY_LOGGER = process.env.FASTIFY_LOGGER === 'true';
export const APPLICATION_JSON = 'application/json';
export const V1 = 'v1';
export const QUEUE_MAX_SIZE = 2_000_000_000;
export const QUEUE_PREFIX = process.env.QUEUE_PREFIX as string;
export const RABBITMQ_RECONNECT_TIMEOUT = 2000;
export const REDIS_WS_NAME = 'ws';
export const REDIS_RESERVED = [REDIS_WS_NAME];
