import { QueueService } from './QueueService';
import { container, TYPES } from "./Container";

export interface IChannel {
  sendToQueue: (queue: string, message: Buffer, options?: {}) => Promise<any>;
  assertQueue: (queue, options) => Promise<any>;
  consume: (
    queue: string,
    callback: (data: { content: Buffer }) => void
  ) => void;
  getQueue: (queue: string) => any;
} 

export class Channel implements IChannel {
  private queueService: QueueService;

  constructor() {
    this.queueService = container.get<QueueService>(TYPES.queueService);
  }

  async sendToQueue(queue: string, message: Buffer, options?: {}) {
    return new Promise((resolve, reject) => {
      try {
        this.queueService.publish(queue, message);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async assertQueue(queue: string, options: {}) {
    return new Promise(resolve => {
      resolve();
    });
  }

  consume(queue: string, callback: (data: { content: Buffer }) => void) {
    const currentQueue: Buffer[] = this.queueService.consume(queue);

    if (currentQueue && currentQueue.length > 0) {
      for (let i = 0; i < currentQueue.length; i++) {
        const message = { content: currentQueue[i] };
        delete currentQueue[i];
        callback(message);
      }
    }
  }

  getQueue(queue: string) {
    return this.queueService.consume(queue, { readonly: true });
  }
} 