import cluster from 'cluster';
import { log } from './utils/lib';
import { ORM } from './services/orm';

if (cluster.isPrimary) {
  process.setMaxListeners(0);

  process.on('uncaughtException', (err: Error) => {
    log('error', '[MASTER] uncaughtException', err);
  });
  process.on('unhandledRejection', (err: Error) => {
    log('error', '[MASTER] unhandledRejection', err);
  });

  const worker = cluster.fork();
  new ORM(worker);
} else {
  import('./http');
}
