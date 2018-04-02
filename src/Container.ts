import { Container } from 'inversify';
import { QueueService, QueueServiceImplementation } from './QueueService';
export const TYPES = {
  queueService: Symbol("queue-service")
};

const container = new Container();
container.bind<QueueService>(TYPES.queueService).to(QueueServiceImplementation);
export { container };
