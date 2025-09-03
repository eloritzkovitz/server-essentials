import { rabbitMQService } from "../../src/messaging/rabbitMQService";
import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";

jest.mock("amqplib");
jest.mock("uuid", () => ({ v4: jest.fn(() => "test-correlation-id") }));

const mockChannel = {
  assertQueue: jest.fn(),
  consume: jest.fn(),
  sendToQueue: jest.fn(),
  close: jest.fn(),
};
const mockConnection = {
  createChannel: jest.fn().mockResolvedValue(mockChannel),
};

(amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

describe("RabbitMQService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rabbitMQService["initialized"] = false;
    rabbitMQService["channel"] = undefined as any;
    rabbitMQService["correlationMap"].clear();
  });

  it("init connects and creates channel", async () => {
    await rabbitMQService.init();
    expect(amqp.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(rabbitMQService["initialized"]).toBe(true);
    expect(rabbitMQService["channel"]).toBe(mockChannel);
  });

  it("init does not reconnect if already initialized", async () => {
    rabbitMQService["initialized"] = true;
    await rabbitMQService.init();
    expect(amqp.connect).not.toHaveBeenCalled();
  });

  it("init throws after all retries fail", async () => {
    (amqp.connect as jest.Mock)
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"));

    await expect(rabbitMQService.init(5, 1)).rejects.toThrow(
      "Failed to connect to RabbitMQ after multiple attempts."
    );
  });

  it("close calls channel.close and resets initialized", async () => {
    rabbitMQService["initialized"] = true;
    rabbitMQService["channel"] = mockChannel as any;
    await rabbitMQService.close();
    expect(mockChannel.close).toHaveBeenCalled();
    expect(rabbitMQService["initialized"]).toBe(false);
  });

  it("close does nothing if not initialized", async () => {
    rabbitMQService["initialized"] = false;
    await rabbitMQService.close();
    expect(mockChannel.close).not.toHaveBeenCalled();
  });

  it("close logs error if channel.close throws", async () => {
    rabbitMQService["initialized"] = true;
    rabbitMQService["channel"] = {
      close: jest.fn().mockImplementation(() => {
        throw new Error("close error");
      }),
    } as any;
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await rabbitMQService.close();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error closing RabbitMQ connection:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("publishNotification asserts queue and sends message", async () => {
    await rabbitMQService.publishNotification("testQueue", { foo: "bar" });
    expect(mockChannel.assertQueue).toHaveBeenCalledWith("testQueue", {
      durable: true,
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      "testQueue",
      Buffer.from(JSON.stringify({ foo: "bar" }))
    );
  });

  it("requestRPC asserts queues, sets up consume, and sends request", async () => {
    const callback = jest.fn();

    let handlerFn: any;
    mockChannel.consume.mockImplementation((_queue, handler) => {
      handlerFn = handler;
    });

    await rabbitMQService.requestRPC(
      "reqQueue",
      "resQueue",
      { test: 123 },
      callback
    );

    // Simulate receiving a message after requestRPC has set up the map
    const msg = {
      properties: { correlationId: "test-correlation-id" },
      content: Buffer.from(JSON.stringify({ result: "ok" })),
    };
    handlerFn(msg);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith("reqQueue", {
      durable: true,
    });
    expect(mockChannel.assertQueue).toHaveBeenCalledWith("resQueue", {
      durable: true,
    });
    expect(mockChannel.consume).toHaveBeenCalledWith(
      "resQueue",
      expect.any(Function),
      { noAck: true }
    );
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      "reqQueue",
      Buffer.from(JSON.stringify({ test: 123 })),
      { correlationId: "test-correlation-id", replyTo: "resQueue" }
    );
    expect(callback).toHaveBeenCalledWith({ result: "ok" });
  });
});
