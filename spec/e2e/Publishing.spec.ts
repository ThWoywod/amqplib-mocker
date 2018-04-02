import * as amqp from 'amqplib';
import { ConnectionManager } from '../../src/ConnectionManager';
import { Connection } from '../../src/Connection';
import { Channel } from '../../src/Channel';

describe("E2E", function () {
  class Publishing {
    private connection: amqp.Connection;

    async push(queueName: string, message: Buffer) {
      if (!this.connection) {
        this.connection = await amqp.connect({});
      }
      const channel: amqp.Channel = await this.connection.createChannel();
      channel.sendToQueue(queueName, message, {});
    }
  }
  describe("publishing", function () {
    beforeEach(async function () {
      this.publishing = new Publishing();
      this.connection = await new ConnectionManager().connect("localhost");
      this.publishing.connection = this.connection;
    })

    interface This {
      publishing: Publishing;
      connection: Connection;
    }
    it("should push message to queue", async function (this: This) {
      this.publishing.push("q1", new Buffer("test"));
      const channel: Channel = await this.connection.createChannel();
      expect(channel.getQueue("q1")).toEqual([new Buffer("test")]);
    })
  })
})