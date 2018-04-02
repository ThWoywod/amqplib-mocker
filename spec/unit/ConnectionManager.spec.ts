import { ConnectionManager } from "../../src/ConnectionManager";
describe("ConnectionManager", function () {
  interface This {
    connectionManager: ConnectionManager
  }
  beforeEach(function (this: This) {
    this.connectionManager = new ConnectionManager();
  })

  describe("connect", function (this: This) {

    describe("return uniq connections", function (this: This) { 

      it("for url localhost", async function (this: This) {
        const connectLocalhost1 = await this.connectionManager.connect("localhost");
        const connectLocalhost2 = await this.connectionManager.connect("localhost");
        expect(connectLocalhost1).toBe(connectLocalhost2);
      })

      it("for each url", async function (this: This) {
        const connectLocalhost1 = await this.connectionManager.connect("localhost");
        const connectHost2 = await this.connectionManager.connect("host");
        expect(connectLocalhost1).not.toBe(connectHost2);
      })
    });
  })
});