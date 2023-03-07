import { User } from '@prisma/client';
import { MessageType, SendMessageArgs } from '../types/interfaces';

export function cleanUserFields(
  user: User | null
): SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'] | null {
  if (!user) {
    return user;
  }
  const _user: Partial<User> = { ...user };
  if (_user) {
    delete _user.password;
    delete _user.salt;
  }
  return _user as Required<User>;
}
