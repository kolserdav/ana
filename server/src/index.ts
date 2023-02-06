import cluster from 'cluster';
import HandleRequests from './services/handleRequests';
import { log } from './utils/lib';
import WS from './protocols/ws';
import { ORM } from './services/orm';

if (cluster.isPrimary) {
  process.on('uncaughtException', (err: Error) => {
    log('error', '[MASTER] uncaughtException', err);
  });
  process.on('unhandledRejection', (err: Error) => {
    log('error', '[MASTER] unhandledRejection', err);
  });

  const worker = cluster.fork();
  new WS();
  new HandleRequests({ worker });
  new ORM(worker);
} else {
  import('./http');
}
