import { ORM } from './services/orm';
import QueueWorker from './controllers/queueWorker';
import { log } from './utils/lib';

process.on('uncaughtException', (err: Error) => {
  log('error', '[QUEUE_WORKER] uncaughtException', err);
});
process.on('unhandledRejection', (err: Error) => {
  log('error', '[QUEUE_WORKER] unhandledRejection', err);
});

new ORM();
new QueueWorker({ protocol: 'ws' });
new QueueWorker({ protocol: 'request' });
