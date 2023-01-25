import { createClient, RedisClientType } from 'redis';
import { REDIS_PASS, REDIS_WS_NAME } from '../utils/constants';
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

  private parseRedisWS(val: string | null) {
    let valP: string[] = [];
    if (val) {
      try {
        valP = JSON.parse(val);
      } catch (err) {
        log('error', 'Error parse redis WS', err);
      }
    }
    return valP;
  }

  public async setWS(id: string) {
    const val = await this.client.get(REDIS_WS_NAME);
    const valP = this.parseRedisWS(val);
    if (valP.indexOf(id) === -1) {
      valP.push(id);
    } else {
      log('warn', 'Duplicate WS value on redis', { id });
      return valP;
    }
    await this.client.set(REDIS_WS_NAME, JSON.stringify(valP));
    return valP;
  }

  public async deleteWS(id: string) {
    const val = await this.client.get(REDIS_WS_NAME);
    let valP = this.parseRedisWS(val);
    const index = valP.indexOf(id);
    if (index === -1) {
      log('warn', 'Deleted WS item on redis is missing', { id });
      return valP;
    }
    valP = valP.splice(index, 1);
    await this.client.set(REDIS_WS_NAME, JSON.stringify(valP));
    return valP;
  }

  public async checkWS(id: string) {
    const val = await this.client.get(REDIS_WS_NAME);
    const valP = this.parseRedisWS(val);
    return valP.indexOf(id) !== -1;
  }
}

export default Redis;
