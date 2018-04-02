import * as amqp from 'amqplib';
import { ConnectionManager } from '../../src/ConnectionManager';
import { Connection } from '../../src/Connection';
import { Channel } from '../../src/Channel';

describe("E2E", function () {
  class Consuming {
    private connection: amqp.Connection;

    async subscribe(queueName: string, callback: (data) => void) {
      if (!this.connection) {
        this.connection = await amqp.connect({});
      }
      const channel: amqp.Channel = await this.connection.createChannel();
      channel.consume(queueName, callback, {});
    }
  }
  describe("consuming", function() {
    beforeEach(async function() {
      this.consuming = new Consuming();
      this.connection = await new ConnectionManager().connect("localhost");
      this.channel = await this.connection.createChannel();
      this.consuming.connection = this.connection;
    });

    interface This {
      observable: {callback: () => void};
      consuming: Consuming;
      connection: Connection;
      channel: Channel
    }

    describe("subscribe", function (this: This) {
      describe("with message in queue 'q1'", function(this: This) {
        beforeEach(async function (this: This) {
          this.observable = { callback: () => { } }
          spyOn(this.observable, "callback");
          this.channel.sendToQueue("q1", new Buffer("message1"));
        });

        it("subscribe q1 returns callback with message", async function (this: This, done) {
          this.consuming.subscribe("q1", message => {
            expect(message).toEqual({ content: new Buffer("message1") })
            done();
          });
        });

        it("subscribe q1 callback will called", async function(this: This, done) {
          this.consuming.subscribe("q1", (data) => { this.observable.callback(); });
          setTimeout(() => { 
            expect(this.observable.callback).toHaveBeenCalled();
            done();
          },10)
        });

        it("subscribe q2 callback never called", async function(
          this: This,
          done
        ) {
          this.consuming.subscribe("q2", data => {
            this.observable.callback();
          });
          setTimeout(() => {
            expect(this.observable.callback).not.toHaveBeenCalled();
            done();
          }, 40);
        });
      });


    });
  });
});