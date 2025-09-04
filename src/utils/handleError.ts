import { Response } from "express";
import { logger } from "../logging/logger";

/**
 * Handles errors in controller functions by logging and sending a generic response.
 *
 * - Logs the error message and error object.
 * - Sends a generic error response in production.
 * - Optionally includes error details in development for debugging.
 * - Supports custom error codes.
 *
 * @param res - The Express response object.
 * @param message - The error message to log and send.
 * @param error - The error object (optional, for logging).
 * @param status - The HTTP status code (default: 500).
 * @param code - Optional custom error code for the response.
 *
 * @example
 * handleError(res, "Failed to fetch user", err, 404, "USER_NOT_FOUND");
 */
export function handleError(
  res: Response,
  message: string,
  error?: unknown,
  status = 500,
  code?: string
) {
  logger.error("%s: %o", message, error);

  const response: Record<string, any> = { message };
  if (code) response.code = code;

  // Include error details in development only
  if (process.env.NODE_ENV !== "production" && error) {
    response.error =
      error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
  }

  res.status(status).json(response);
}
