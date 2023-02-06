import QueueWorker from './services/queueWorker';

new QueueWorker({ protocol: 'ws' });
new QueueWorker({ protocol: 'request' });
