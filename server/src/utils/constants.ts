import dotenv from 'dotenv';

dotenv.config();

export const AMQP_ADDRESS = process.env.AMQP_ADDRESS as string;
export const PORT = parseInt(process.env.PORT as string, 10);
export const LOG_LEVEL = parseInt(process.env.LOG_LEVEL as string, 10);
export const IS_DEV = process.env.NODE_ENV === 'development';
export const FASTIFY_LOGGER = process.env.FASTIFY_LOGGER === 'true';
export const APPLICATION_JSON = 'application/json';
export const V1 = 'v1';
export const QUEUE_MAX_SIZE = 2_000_000_000;
export const QUEUE_NAME = 'handle_request';
