import { injectable } from 'inversify';
export interface QueueService {
  consume: (queue: string, options?: { readonly: boolean }) => any;
  publish: (queue: string, data) => void;
}

@injectable()
export class QueueServiceImplementation implements QueueService {
  private queues: { [name: string]: any[] } = {};
  

  public consume(queue: string, options?: { readonly: boolean }) {
    if (!this.queues[queue]) { 
      this.queues[queue] = [];
    }
    const currentQueue = this.queues[queue];
    if (options && options.readonly === false) {
      this.queues[queue] = [];
    }
    return currentQueue;
  }

  public publish(queue: string, data) {
    if (!this.queues[queue]) {
      this.queues[queue] = [];
    }
    this.queues[queue].push(data);
  }
}
