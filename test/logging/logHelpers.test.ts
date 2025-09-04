import { logError, logWithRequestId, maskSensitive } from "../../src/logging/logHelpers";
import { logger } from "../../src/logging/logger";

jest.mock("../../src/logging/logger");

describe("logHelpers", () => {
  beforeEach(() => {
    (logger.error as jest.Mock).mockClear();
    (logger.log as jest.Mock).mockClear();
  });

  it("logError logs error with stack and context", () => {
    const error = new Error("fail");
    error.name = "CustomError";
    error.stack = "stacktrace";
    const context = { foo: "bar" };
    logError(error, context);
    expect(logger.error).toHaveBeenCalledWith(
      "fail",
      expect.objectContaining({
        foo: "bar",
        stack: "stacktrace",
        name: "CustomError"
      })
    );
  });

  it("logWithRequestId logs with requestId and meta", () => {
    logWithRequestId("info", "message", "req-123", { user: "u1" });
    expect(logger.log).toHaveBeenCalledWith(
      "info",
      "message",
      expect.objectContaining({
        requestId: "req-123",
        user: "u1"
      })
    );
  });

  it("maskSensitive masks default sensitive fields", () => {
    const obj = { password: "123", token: "abc", other: "ok" };
    const masked = maskSensitive(obj);
    expect(masked.password).toBe("***");
    expect(masked.token).toBe("***");
    expect(masked.other).toBe("ok");
  });

  it("maskSensitive masks custom fields", () => {
    const obj = { secret: "hide", foo: "bar" };
    const masked = maskSensitive(obj, ["secret"]);
    expect(masked.secret).toBe("***");
    expect(masked.foo).toBe("bar");
  });
});
