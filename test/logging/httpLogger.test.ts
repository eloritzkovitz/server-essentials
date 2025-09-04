import { httpLogger } from "../../src/logging/httpLogger";
import { logger } from "../../src/logging/logger";

jest.mock("../../src/logging/logger");

describe("httpLogger middleware", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      method: "GET",
      originalUrl: "/test",
      ip: "127.0.0.1",
    };
    res = {
      statusCode: 200,
      on: jest.fn((event, handler) => {
        if (event === "finish") {
          handler();
        }
      }),
    };
    next = jest.fn();
    (logger.log as jest.Mock).mockClear();
  });

  it("logs info for 2xx responses", () => {
    res.statusCode = 200;
    httpLogger(req, res, next);
    expect(logger.log).toHaveBeenCalledWith(
      "info",
      "GET /test 200 0ms",
      expect.objectContaining({
        type: "http",
        method: "GET",
        url: "/test",
        status: 200,
        ip: "127.0.0.1",
      })
    );
    expect(next).toHaveBeenCalled();
  });

  it("logs warn for 4xx responses", () => {
    res.statusCode = 404;
    httpLogger(req, res, next);
    expect(logger.log).toHaveBeenCalledWith(
      "warn",
      "GET /test 404 0ms",
      expect.objectContaining({
        type: "http",
        status: 404,
      })
    );
  });

  it("logs error for 5xx responses", () => {
    res.statusCode = 500;
    httpLogger(req, res, next);
    expect(logger.log).toHaveBeenCalledWith(
      "error",
      "GET /test 500 0ms",
      expect.objectContaining({
        type: "http",
        status: 500,
      })
    );
  });
});
