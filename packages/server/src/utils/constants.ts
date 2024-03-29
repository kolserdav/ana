import { Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { log } from 'console';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const CLOUD_PATH = path.resolve(__dirname, '../../../../cloud');

const CONFIG_ARRAY_DELIMITER = ',';

let logLevel = parseInt(process.env.LOG_LEVEL as string, 10);
if (isNaN(logLevel)) {
  logLevel = 0;
}
export const LOG_LEVEL = logLevel;
if (LOG_LEVEL < 2) {
  log('info', 'LOG_LEVEL:', LOG_LEVEL);
}
if (LOG_LEVEL < 2) {
  log('info', 'Load environment variables:');
}
export const NODE_ENV = process.env.NODE_ENV as string;
if (LOG_LEVEL < 2) {
  log('info', 'NODE_ENV:', NODE_ENV);
}

export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL as string;
if (!SUPPORT_EMAIL) {
  log('warn', 'SUPPORT_EMAIL:', SUPPORT_EMAIL);
}

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
if (!ADMIN_EMAIL) {
  log('warn', 'ADMIN_EMAIL:', ADMIN_EMAIL);
}

export const HOST = process.env.HOST as string;
if (!HOST) {
  log('warn', 'HOST:', HOST);
}

export const SMTP_EMAIL = process.env.SMTP_EMAIL as string;
if (!SMTP_EMAIL) {
  log('warn', 'SMTP_EMAIL:', SMTP_EMAIL);
}

export const WS_PORT = parseInt(process.env.WS_PORT as string, 10);
if (!WS_PORT) {
  log('warn', 'WS_PORT:', WS_PORT);
}

export const SMTP_HOST = process.env.SMTP_HOST as string;
if (!SMTP_HOST) {
  log('warn', 'SMTP_HOST:', SMTP_HOST);
}

export const SMTP_PORT = parseInt(process.env.SMTP_PORT as string, 10);
if (!SMTP_PORT) {
  log('warn', 'SMTP_PORT:', SMTP_PORT);
}

export const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;
if (!SMTP_PASSWORD) {
  log('warn', 'SMTP_PASSWORD:', SMTP_PASSWORD);
}
export const TRANSLATE_URL = process.env.TRANSLATE_URL as string;
if (!TRANSLATE_URL) {
  log('warn', 'TRANSLATE_URL:', TRANSLATE_URL);
}
export const APP_URL = process.env.APP_URL as string;
if (!APP_URL) {
  log('warn', 'APP_URL:', APP_URL);
}
if (!APP_URL) {
  log('warn', 'APP_URL:', APP_URL);
}
export const CORS = (process.env.CORS || APP_URL).split(CONFIG_ARRAY_DELIMITER);

export const JSONWEBTOKEN_KEY = process.env.JSONWEBTOKEN_KEY as string;
if (!JSONWEBTOKEN_KEY) {
  log('warn', 'JSONWEBTOKEN_KEY:', JSONWEBTOKEN_KEY);
}
export const PORT = parseInt(process.env.PORT as string, 10);
if (LOG_LEVEL < 2) {
  log('info', 'PORT:', PORT);
}

export const IS_DEV = process.env.NODE_ENV === 'development';
export const FASTIFY_LOGGER = process.env.FASTIFY_LOGGER === 'true';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PRISMA_LOG: Prisma.LogLevel = process.env.PRISMA_LOG as any;

export const PASSWORD_SALT_LENGTH = 16;
export const PASWWORD_HASH_LENGTH = 64;
export const PASSWORD_ITERATIONS = 1000;
export const PASSWORD_ALGORITHM = 'sha512';
export const RESTORE_LINK_TIMEOUT_IN_HOURS = 48;
export const NULL_TIMEOUT = new Date(0, 0, 0, 0, 0, 0, 0);
export const CHECK_SERVER_MESSAGES_INTERVAL = 3000;
export const CHECK_TRANSLATE_SERVICE_TIMEOUT = 5000;
export const SCRIPT_FILE_SERVER_MESSAGES = 'server-messages.js';
export const USER_NAME_DEFAULT = 'Anon';
// deps android/app/src/main/java/com/kolserdav/ana/Config.java.WS_MESSAGE_NOTIFICATION_USER_ID
export const WS_MESSAGE_NOTIFICATION_USER_ID = 'notification_user_id';
export const CHECK_PUSH_NOTIFICATION_INTERVAL = 3000;
export const PUSH_NOTIFICATION_MIN_TIME = 12;
export const PUSH_NOTIFICATION_MAX_TIME = 20;
// deps android/app/src/main/res/values/strings.xml app_name
export const ANDROID_APP_NAME = 'Ana';
