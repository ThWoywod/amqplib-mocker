import {
  QueueService,
  QueueServiceImplementation
} from "../../src/QueueService";
import { Container } from 'inversify';
import { TYPES } from "../../src/Container";

describe("QueueService", function () {
  interface This {
    queueService: QueueService;
    container: Container;
  }

  describe("is injectable", function (this: This) { 
    beforeEach(function (this: This) { 
      this.container = new Container();
      this.container
        .bind<QueueService>(TYPES.queueService)
        .to(QueueServiceImplementation);

      this.queueService = this.container.get<QueueService>(TYPES.queueService);
    })

    it("is not undefined", function () {
      expect(this.queueService).not.toBeUndefined();
    });

    it("is not NaN", function() {
      expect(this.queueService).not.toBeNaN();
    });

    it("is not Null", function() {
      expect(this.queueService).not.toBeNull();
    });

    it("queueService is a QueueServiceImplementation", function (this: This) {
      expect(this.queueService instanceof QueueServiceImplementation).toBeTruthy();
    });
  });

  describe("consume", function () {
    beforeEach(function () {
      this.queueService = new QueueServiceImplementation();
    })

    describe("with empty queues", function() {
      it("return empty array for queue q1", function() {
        expect(this.queueService.consume("q1")).toEqual([]);
      });

      it("return empty array for queue q2", function() {
        expect(this.queueService.consume("q2")).toEqual([]);
      });
    });

    describe("with single message in queue q1", function () {
      beforeEach(function () {
        this.queueService.queues['q1'] = [new Buffer("message1")]
      })
      it("return single element by consuming queue q1", function() {
        expect(this.queueService.consume("q1")).toEqual([
          new Buffer("message1")
        ]);
      });

      it("return empty array for queue q2", function() {
        expect(this.queueService.consume("q2")).toEqual([]);
      });
    });

    describe("with single message in queue q1 and q2", function() {
      beforeEach(function() {
        this.queueService.queues["q1"] = [new Buffer("message1")];
        this.queueService.queues["q2"] = [new Buffer("message2")];
      });
      it("return message1 by consuming queue q1", function() {
        expect(this.queueService.consume("q1")).toEqual([
          new Buffer("message1")
        ]);
      });

      it("does not return message2 by consuming queue q1", function() {
        expect(this.queueService.consume("q1")).not.toEqual([
          new Buffer("message2")
        ]);
      });

      it("return message2 by consuming queue q2", function() {
        expect(this.queueService.consume("q2")).toEqual([
          new Buffer("message2")
        ]);
      });

      it("does not return message1 by consuming queue q2", function() {
        expect(this.queueService.consume("q2")).not.toEqual([
          new Buffer("message1")
        ]);
      });
    });
  });

  describe("publish", function() {
    beforeEach(function() {
      this.queueService = new QueueServiceImplementation();
    });

    it("is a function", function (this: This) {
      expect(typeof this.queueService.publish).toEqual("function");
    })

    describe("when publishing single message to q1", function () {
      beforeEach(function () {
        this.queueService.publish("q1", new Buffer("message"));
      })
      it("q1 includes message", function () {
        expect(this.queueService.queues["q1"]).toEqual([new Buffer("message")]);
      })

      it("q2 does not includes message", function() {
        expect(this.queueService.queues["q2"]).not.toEqual([
          new Buffer("message")
        ]);
      });
    });

    describe("when publishing single message to q1 and q2", function() {
      beforeEach(function() {
        this.queueService.publish("q1", new Buffer("message1"));
        this.queueService.publish("q2", new Buffer("message2"));
      });

      it("q1 includes message1", function () {
        expect(this.queueService.queues["q1"]).toContain(
          new Buffer("message1")
        );
      });

      it("q1 does not includes message2", function() {
        expect(this.queueService.queues["q1"]).not.toContain(
          new Buffer("message2")
        );
      });

      it("q2 includes message2", function() {
        expect(this.queueService.queues["q2"]).toContain(
          new Buffer("message2")
        );
      });

      it("q2 does not includes message1", function() {
        expect(this.queueService.queues["q2"]).not.toContain(
          new Buffer("message1")
        );
      });
    });
  });
});