import amqp, { Channel } from "amqplib";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config";

type RPCResponseCallback = (response: any) => void;

class RabbitMQService {
  private channel!: Channel;
  private correlationMap = new Map<string, RPCResponseCallback>();
  private initialized = false;

  constructor() {}

  async init() {
    if (this.initialized) return;
    const connection = await amqp.connect(config.msgBrokerURL!);
    this.channel = await connection.createChannel();
    this.initialized = true;
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

export const rabbitMQService = new RabbitMQService();