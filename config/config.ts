import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized configuration object for server essentials.
 *
 * Loads environment variables using dotenv and provides defaults for various services.
 *
 */
const config = {    
  jwt: {
    secret: process.env.TOKEN_SECRET || "",
    expires: process.env.TOKEN_EXPIRES || "1h",
    refreshExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 465,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "",
  },
  firebase: {
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
  },
  messaging: {
    rabbitMQURL: process.env.RABBITMQ_URL || "amqp://localhost",
    notificationsQueue: process.env.NOTIFICATIONS_QUEUE || "NOTIFICATIONS_QUEUE",
  },
  uploadDir: process.env.UPLOAD_DIR || "uploads",
};

export default config;