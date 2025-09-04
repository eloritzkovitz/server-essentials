import { Logger, createLogger, format, transports } from "winston";

/**
 * Logger configuration options.
 */
export type LoggerOptions = {
  /** If true, use production logging (console JSON only). */
  production?: boolean;
};

/**
 * Builds a Winston logger instance with environment-aware configuration.
 *
 * - In production/Docker: logs to console in JSON format (no file logs).
 * - In development: logs to colorized console and writes logs to files.
 *
 * @param options - Logger configuration options.
 * @returns Winston logger instance.
 *
 * @example
 * // Development logger
 * const devLogger = buildLogger();
 *
 * // Production logger
 * const prodLogger = buildLogger({ production: true });
 */
export function buildLogger(options: LoggerOptions = {}): Logger {
  const { production = false } = options;

  const consoleTransport = production
    ? new transports.Console({
        format: format.combine(format.timestamp(), format.json()),
      })
    : new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      });

  const fileTransports = production
    ? []
    : [
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/warn.log", level: "warn" }),
        new transports.File({ filename: "logs/info.log", level: "info" }),
        new transports.File({ filename: "logs/combined.log" }),
      ];

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [consoleTransport, ...fileTransports],
    exitOnError: false,
  });
}

/**
 * Default Winston logger instance.
 * Uses production mode if NODE_ENV is 'production' or DOCKER is 'true'.
 */
export const logger = buildLogger({
  production:
    process.env.NODE_ENV === "production" || process.env.DOCKER === "true",
});
