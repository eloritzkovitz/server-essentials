import { describe, it, expect, beforeEach, vi } from "vitest";
import { rabbitMQService } from "../../src/messaging/rabbitMQService.js";
import amqp from "amqplib";

vi.mock("amqplib");
vi.mock("uuid", () => ({ v4: vi.fn(() => "test-correlation-id") }));

const mockChannel = {
  assertQueue: vi.fn<(...args: any[]) => Promise<any>>(),
  consume: vi.fn<(...args: any[]) => Promise<any>>(),
  sendToQueue: vi.fn<(...args: any[]) => boolean>(),
  close: vi.fn<(...args: any[]) => Promise<void>>(),
};
const mockConnection = {
  createChannel: vi.fn<() => Promise<any>>().mockResolvedValue(mockChannel),
};

(amqp.connect as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
  mockConnection,
);

describe("RabbitMQService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (rabbitMQService as any)["initialized"] = false;
    (rabbitMQService as any)["channel"] = undefined;
    (rabbitMQService as any)["correlationMap"].clear();
  });

  it("init connects and creates channel", async () => {
    await rabbitMQService.init();
    expect(amqp.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect((rabbitMQService as any)["initialized"]).toBe(true);
    expect((rabbitMQService as any)["channel"]).toBe(mockChannel);
  });

  it("init does not reconnect if already initialized", async () => {
    (rabbitMQService as any)["initialized"] = true;
    await rabbitMQService.init();
    expect(amqp.connect).not.toHaveBeenCalled();
  });

  it("init throws after all retries fail", async () => {
    (amqp.connect as unknown as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"));

    await expect(rabbitMQService.init(5, 1)).rejects.toThrow(
      "Failed to connect to RabbitMQ after multiple attempts.",
    );
  });

  it("close calls channel.close and resets initialized", async () => {
    (rabbitMQService as any)["initialized"] = true;
    (rabbitMQService as any)["channel"] = mockChannel;
    await rabbitMQService.close();
    expect(mockChannel.close).toHaveBeenCalled();
    expect((rabbitMQService as any)["initialized"]).toBe(false);
  });

  it("close does nothing if not initialized", async () => {
    (rabbitMQService as any)["initialized"] = false;
    await rabbitMQService.close();
    expect(mockChannel.close).not.toHaveBeenCalled();
  });

  it("close logs error if channel.close throws", async () => {
    (rabbitMQService as any)["initialized"] = true;
    (rabbitMQService as any)["channel"] = {
      close: vi.fn<() => Promise<void>>().mockImplementation(() => {
        throw new Error("close error");
      }),
    };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await rabbitMQService.close();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error closing RabbitMQ connection:",
      expect.any(Error),
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
      Buffer.from(JSON.stringify({ foo: "bar" })),
    );
  });

  it("requestRPC asserts queues, sets up consume, and sends request", async () => {
    const callback = vi.fn();

    let handlerFn: any;
    mockChannel.consume.mockImplementation((_queue: any, handler: any) => {
      handlerFn = handler;
      return Promise.resolve({ consumerTag: "test" });
    });

    await rabbitMQService.requestRPC(
      "reqQueue",
      "resQueue",
      { test: 123 },
      callback,
    );

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
      { noAck: true },
    );
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      "reqQueue",
      Buffer.from(JSON.stringify({ test: 123 })),
      { correlationId: "test-correlation-id", replyTo: "resQueue" },
    );
    expect(callback).toHaveBeenCalledWith({ result: "ok" });
  });
});
