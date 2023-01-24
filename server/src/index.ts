import cluster from 'cluster';
import HandleRequests from './services/handleRequests';
import { log } from './utils/lib';
import WS from './services/ws';
import HandleWS from './services/handleWS';

if (cluster.isPrimary) {
  process.on('uncaughtException', (err: Error) => {
    log('error', '[MASTER] uncaughtException', err);
  });
  process.on('unhandledRejection', (err: Error) => {
    log('error', '[MASTER] unhandledRejection', err);
  });

  const worker = cluster.fork();
  const ws = new WS();
  const caller = 'index';
  new HandleRequests({ protocol: 'request', caller, ws, worker });
  new HandleRequests({ protocol: 'ws', caller, ws, worker });
  new HandleWS({ ws });
} else {
  import('./http');
}
