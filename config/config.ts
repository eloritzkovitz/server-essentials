import dotenv from "dotenv";
dotenv.config();

const config = {
  msgBrokerURL: process.env.RABBITMQ_URL || "amqp://localhost",
  queue: {
    notifications: process.env.NOTIFICATIONS_QUEUE || "NOTIFICATIONS_QUEUE",
  },
};

export default config;