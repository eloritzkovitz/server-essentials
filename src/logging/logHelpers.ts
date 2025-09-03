import { logger } from "./logger";

/**
 * Logs an error with stack trace and optional context.
 */
export function logError(error: Error, context?: object) {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
    name: error.name,
  });
}

/**
 * Logs a message with a correlation/request ID for tracing.
 */
export function logWithRequestId(level: "info" | "warn" | "error", message: string, requestId: string, meta?: object) {
  logger.log(level, message, {
    requestId,
    ...meta,
  });
}

/**
 * Masks sensitive fields in an object before logging.
 */
export function maskSensitive(obj: Record<string, any>, fields: string[] = ["password", "token"]) {
  const clone = { ...obj };
  for (const field of fields) {
    if (clone[field]) clone[field] = "***";
  }
  return clone;
}