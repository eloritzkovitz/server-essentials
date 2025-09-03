import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

/**
 * Express middleware for logging HTTP requests and responses.
 * Logs method, URL, status code, response time, and marks log type as 'http'.
 * Uses log level based on response status.
 */ 
export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    let level: "info" | "warn" | "error" = "info";
    if (res.statusCode >= 500) level = "error";
    else if (res.statusCode >= 400) level = "warn";
    logger.log(
      level,
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      {
        type: "http",
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        ip: req.ip,
      }
    );
  });
  next();
}
