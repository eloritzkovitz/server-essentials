import { describe, it, expect, beforeEach, vi } from "vitest";
import { httpLogger } from "../../src/logging/httpLogger.js";
import { logger } from "../../src/logging/logger.js";

vi.mock("../../src/logging/logger.js");

describe("httpLogger middleware", () => {
  let req: any, res: any, next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    req = {
      method: "GET",
      originalUrl: "/test",
      ip: "127.0.0.1",
    };
    res = {
      statusCode: 200,
      on: vi.fn((event: string, handler: (...args: any[]) => void) => {
        if (event === "finish") {
          handler();
        }
      }),
    };
    next = vi.fn();
    (logger.log as unknown as ReturnType<typeof vi.fn>).mockClear();
  });

  it("logs info for 2xx responses", () => {
    res.statusCode = 200;
    httpLogger(req, res, next as any);
    expect(logger.log).toHaveBeenCalledWith(
      "info",
      expect.stringMatching(/^GET \/test 200 \d+ms$/),
      expect.objectContaining({
        type: "http",
        method: "GET",
        url: "/test",
        status: 200,
        ip: "127.0.0.1",
      }),
    );
    expect(next).toHaveBeenCalled();
  });

  it("logs warn for 4xx responses", () => {
    res.statusCode = 404;
    httpLogger(req, res, next as any);
    expect(logger.log).toHaveBeenCalledWith(
      "warn",
      expect.stringMatching(/^GET \/test 404 \d+ms$/),
      expect.objectContaining({
        type: "http",
        status: 404,
      }),
    );
  });

  it("logs error for 5xx responses", () => {
    res.statusCode = 500;
    httpLogger(req, res, next as any);
    expect(logger.log).toHaveBeenCalledWith(
      "error",
      expect.stringMatching(/^GET \/test 500 \d+ms$/),
      expect.objectContaining({
        type: "http",
        status: 500,
      }),
    );
  });
});
