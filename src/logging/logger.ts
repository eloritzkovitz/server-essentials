import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/warn.log", level: "warn" }),
    new transports.File({ filename: "logs/info.log", level: "info" }),
    new transports.File({ filename: "logs/combined.log" })
  ],
  exitOnError: false,
});
