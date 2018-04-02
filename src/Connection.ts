import { Channel } from './Channel';

export interface IConnection {
  createChannel: () => Promise<Channel>;
} 

export class Connection implements IConnection {
  private channel: Channel = new Channel();
  async createChannel() {
    return new Promise<Channel>((resolve, reject) => {
      resolve(this.channel);
    });
  }
}

