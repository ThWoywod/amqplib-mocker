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
      channel: Channel;
    }

    describe("message to queue q1", function (this: This) {
      beforeEach(async function () {
        this.publishing.push("q1", new Buffer("message"));
        this.channel = await this.connection.createChannel();
      })
      it("expect queue 'q1' to equal's one message", function (this: This) {
        expect(this.channel.getQueue("q1").length).toEqual(1);
      });
  
      it("expect queue 'q1' to equal's message", function(this: This) {
        expect(this.channel.getQueue("q1")).toEqual([
          new Buffer("message")
        ]);
      });

      it("expect queue 'q2' to equal's no message", function(this: This) {
        expect(this.channel.getQueue("q2").length).toEqual(0);
      });

      it("expect queue 'q2' to equal's empty array", function(this: This) {
        expect(this.channel.getQueue("q2")).toEqual([]);
      });
    });

    describe("message to queue q1 and q2", function(this: This) {
      beforeEach(async function() {
        this.publishing.push("q1", new Buffer("message1"));
        this.publishing.push("q2", new Buffer("message2"));
        this.channel = await this.connection.createChannel();
      });
      it("expect queue 'q1' to equal's one message", function(this: This) {
        expect(this.channel.getQueue("q1").length).toEqual(1);
      });

      it("expect queue 'q2' to equal's one message", function(this: This) {
        expect(this.channel.getQueue("q1").length).toEqual(1);
      });

      it("expect queue 'q1' to equal's message1", function(this: This) {
        expect(this.channel.getQueue("q1")).toEqual([
          new Buffer("message1")
        ]);
      });

      it("expect queue 'q2' to equal's message2", function(this: This) {
        expect(this.channel.getQueue("q2")).toEqual([
          new Buffer("message2")
        ]);
      });

      it("expect queue 'q1' not to equal's message2", function(this: This) {
        expect(this.channel.getQueue("q1")).not.toEqual([
          new Buffer("message2")
        ]);
      });

      it("expect queue 'q2' not to equal's message1", function(this: This) {
        expect(this.channel.getQueue("q2")).not.toEqual([
          new Buffer("message1")
        ]);
      });
    });
  })
})