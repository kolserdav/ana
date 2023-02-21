import { createClient, RedisClientType } from 'redis';
import { REDIS_PASS } from '../utils/constants';
import { log } from '../utils/lib';

class Redis {
  public client: RedisClientType;

  constructor() {
    this.client = createClient({ password: REDIS_PASS });
    this.client.on('error', (err) => {
      log('error', 'Redis Client Error', err);
    });
    this.connect();
  }

  private async connect() {
    return this.client.connect();
  }
}

export default Redis;
