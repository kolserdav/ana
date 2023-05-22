import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';
import {
  JSONWEBTOKEN_KEY,
  PASSWORD_ALGORITHM,
  PASSWORD_ITERATIONS,
  PASSWORD_SALT_LENGTH,
  PASWWORD_HASH_LENGTH,
} from './constants';
import { JWTFull } from '../types';
import { log } from './lib';
import { ORM } from '../services/orm';

const orm = new ORM();

export function createToken(parsedToken: Omit<JWTFull, 'iat'>) {
  let token: string | null = null;
  try {
    token = jwt.sign(parsedToken, JSONWEBTOKEN_KEY);
  } catch (err: any) {
    log('error', 'Error create token', { err, parsedToken });
  }
  return token;
}

export function parseToken(token: string): JWTFull | null {
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }
  if (!/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token)) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  try {
    data = jwt.verify(token, JSONWEBTOKEN_KEY);
  } catch (err: any) {
    if (token !== 'null') {
      log('error', 'Error parse JSON token', { err, token });
    }
    data = null;
  }
  return data;
}

export async function comparePasswordHash({
  password,
  hash,
  salt,
}: {
  password: string;
  hash: string;
  salt: string;
}) {
  const newHash = createPasswordHash({ password, salt });
  return hash === newHash;
}

export function createRandomSalt() {
  return randomBytes(PASSWORD_SALT_LENGTH).toString('hex');
}

export function createPasswordHash({ password, salt }: { password: string; salt: string }) {
  return pbkdf2Sync(
    password,
    salt,
    PASSWORD_ITERATIONS,
    PASWWORD_HASH_LENGTH,
    PASSWORD_ALGORITHM
  ).toString('base64');
}

export const checkToken = async (token: string) => {
  const parsedToken = parseToken(token);
  if (!parsedToken) {
    return 1;
  }
  const { id, password } = parsedToken;
  const user = await orm.userFindFirst({
    where: {
      AND: [{ id }, { password }],
    },
  });
  if (user.status === 'error') {
    return 2;
  }
  if (!user.data) {
    return 1;
  }
  return 0;
};
