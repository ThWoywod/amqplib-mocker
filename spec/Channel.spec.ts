import { Channel } from '../src/Channel';
import { QueueServiceImplementation } from '../src/QueueService';
import { Buffer } from 'Buffer';


describe("Channel", function () {
  interface This {
    channel: Channel
  }
  beforeEach(function(this: This) {
    this.channel = new Channel();
  });

  it("should inject QueueService", function (this: This) {
    const currentChannel: any = this.channel;
    expect(currentChannel.queueService instanceof QueueServiceImplementation).toBe(true);
  });

  describe("sendToQueue", function () {
    interface CurrentThis extends This{
      subject: Promise<any>;
    }

    it("should return Promise", function(this: CurrentThis) {
      this.subject = this.channel.sendToQueue("queue1", new Buffer("test"));
      expect(this.subject instanceof Promise).toBeTruthy();
    });

    it("should insert message to queue", async function(this: CurrentThis) {
      await this.channel.sendToQueue("queue1", new Buffer("test"));
      expect(this.channel.getQueue("queue1").length).toBe(1)
    });
  });

  describe("assertQueue", function() {
    interface CurrentThis extends This { subject: Promise<any> }

    it("should return Promise", function(this: CurrentThis) {
      this.subject = this.channel.assertQueue("queue1", new Buffer("test"));
      expect(this.subject instanceof Promise).toBeTruthy();
    });
  });

  describe("consume", function () {
    beforeEach(function (this: This) {
      this.channel.sendToQueue("queue1", new Buffer("queue1-data"));
    });

    it("should return callback with data", function(
      this: This,
      done
    ) {
      this.channel.consume("queue1", (data: {content: Buffer}) => {
        expect(data.content.toString()).toEqual("queue1-data");
        done();
      });
    });

    it("should not call callback because the queue is empty", function(
      this: This
    ) {
      const spy: jasmine.Spy = jasmine.createSpy();
      this.channel.consume("queue2", (data: { content: Buffer }) => {
        spy();
      });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("getQueue", function() {
    it("should return empty list because queue1 is empty", function(this: This) {
      expect(this.channel.getQueue("queue1")).toEqual([])
    });

    it("should return buffer element", function (this: This) {
      this.channel.sendToQueue("queue1", new Buffer("queue1-data"));
      expect(this.channel.getQueue("queue1")).toEqual([
        new Buffer("queue1-data")
      ]);
    });

    describe("with messages in queue2", function () {
      beforeEach(function () { 
        this.channel.sendToQueue("queue2", new Buffer("queue1-data"));
      });

      it("should return empty list because queue1 is empty", function (this: This) {
        expect(this.channel.getQueue("queue1")).toEqual([]);
      });
    });
  });
});