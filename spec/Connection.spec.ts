import { Connection } from '../src/Connection';
import { Channel } from '../src/Channel';

describe("Connection", function () {
  interface This {
    connection: Connection;
  }
  beforeEach(function () { 
    this.connection = new Connection();
  });

  describe("createChannel", function (this: This) {
    it("is a function", function(this: This) {
      expect(typeof this.connection.createChannel).toEqual("function");
    });

    it("return a Promise", function(this: This) {
      expect(this.connection.createChannel() instanceof Promise).toBeTruthy();
    });

    it("return uniq Channel", async function (this: This) {
      const channelCall1 = await this.connection.createChannel();
      const channelCall2 = await this.connection.createChannel();
      expect(channelCall1).toBe(channelCall2);
    });
  });
});