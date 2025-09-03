import amqp, { Channel } from "amqplib";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config";

type RPCResponseCallback = (response: any) => void;

class RabbitMQService {
  private channel!: Channel;
  private correlationMap = new Map<string, RPCResponseCallback>();
  private initialized = false;

  constructor() {}

  /**
   * Initializes the RabbitMQ connection and channel with retry logic.
   * Retries the connection up to `retries` times, waiting `delayMs` milliseconds between attempts.
   * This helps services handle startup timing issues (e.g., when RabbitMQ is not ready in Docker).
   *
   * @param retries - Number of connection attempts before failing (default: 5).
   * @param delayMs - Delay in milliseconds between retries (default: 2000).
   * @throws Error if connection fails after all retries.
   */
  async init(retries = 5, delayMs = 2000) {
    if (this.initialized) return;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const connection = await amqp.connect(config.messaging.rabbitMQURL!);
        this.channel = await connection.createChannel();
        this.initialized = true;
        return;
      } catch (err) {
        console.error(`RabbitMQ connection attempt ${attempt} failed:`, err);
        if (attempt < retries) {
          await new Promise((res) => setTimeout(res, delayMs));
        } else {
          throw new Error(
            "Failed to connect to RabbitMQ after multiple attempts."
          );
        }
      }
    }
  }

  /**
   * Closes the RabbitMQ connection and channel gracefully.
   * Logs any errors encountered during closure.
   */
  async close() {
    if (!this.initialized) return;
    try {
      this.channel.close();
      this.initialized = false;
    } catch (err) {
      console.error("Error closing RabbitMQ connection:", err);
    }
  }

  /**
   * Generic RPC request method.
   * @param requestQueue - The queue to send the request to.
   * @param responseQueue - The queue to listen for the response.
   * @param payload - The request payload.
   * @param callback - Callback to handle the response.
   */
  async requestRPC(
    requestQueue: string,
    responseQueue: string,
    payload: any,
    callback: RPCResponseCallback
  ) {
    await this.init();
    await this.channel.assertQueue(requestQueue, { durable: true });
    await this.channel.assertQueue(responseQueue, { durable: true });

    // Listen for responses and resolve callbacks
    this.channel.consume(
      responseQueue,
      (msg) => {
        if (msg) {
          const correlationId = msg.properties.correlationId;
          const response = JSON.parse(msg.content.toString());
          const cb = this.correlationMap.get(correlationId);
          if (cb) {
            cb(response);
            this.correlationMap.delete(correlationId);
          }
        }
      },
      { noAck: true }
    );

    const correlationId = uuidv4();
    this.correlationMap.set(correlationId, callback);
    this.channel.sendToQueue(
      requestQueue,
      Buffer.from(JSON.stringify(payload)),
      { correlationId, replyTo: responseQueue }
    );
  }

  /**
   * Generic notification publisher.
   * @param queue - The queue to publish to.
   * @param payload - The notification payload.
   */
  async publishNotification(queue: string, payload: any) {
    await this.init();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
  }
}

/**
 * Singleton instance of RabbitMQService for use across the application.
 */
export const rabbitMQService = new RabbitMQService();
