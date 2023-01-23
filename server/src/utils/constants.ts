import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT as string, 10);
export const FASTIFY_LOGGER = process.env.FASTIFY_LOGGER === 'true';
export const APPLICATION_JSON = 'application/json';
export const V1 = 'v1';
