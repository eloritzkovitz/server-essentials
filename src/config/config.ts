import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized configuration object for server essentials.
 * Loads environment variables using dotenv and provides defaults for various services.
 */
const config = {    
  jwt: {
    get secret() { return process.env.TOKEN_SECRET || ""; },
    get expires() { return process.env.TOKEN_EXPIRES || "1h"; },
    get refreshExpires() { return process.env.REFRESH_TOKEN_EXPIRES || "7d"; },
  },
  smtp: {
    get host() { return process.env.SMTP_HOST || ""; },
    get port() { return Number(process.env.SMTP_PORT) || 465; },
    get user() { return process.env.SMTP_USER || ""; },
    get pass() { return process.env.SMTP_PASS || ""; },
    get from() { return process.env.SMTP_FROM || ""; },
  },
  firebase: {
    get credentialsPath() { return process.env.GOOGLE_APPLICATION_CREDENTIALS || ""; },
  },
  messaging: {
    get rabbitMQURL() { return process.env.RABBITMQ_URL || "amqp://localhost"; },
    get notificationsQueue() { return process.env.NOTIFICATIONS_QUEUE || "NOTIFICATIONS_QUEUE"; },
  },
  get uploadDir() { return process.env.UPLOAD_DIR || "uploads"; },
};

export default config;