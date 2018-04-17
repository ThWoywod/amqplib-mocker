import { EventEmitter } from "events";
import { Channel } from "./Channel";

export interface IConnection extends NodeJS.EventEmitter {
  createChannel: () => Promise<Channel>;
} 

export class Connection extends EventEmitter implements IConnection {
  private channel: Channel = new Channel();
  async createChannel() {
    return new Promise<Channel>((resolve, reject) => {
      resolve(this.channel);
    });
  }
}

