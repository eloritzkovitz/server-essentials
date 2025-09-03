import { logger } from "../../src/logging/logger";
import winston from "winston";

describe("logger", () => {
  it("should be a Winston logger instance", () => {
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it("should log info messages", () => {
    const spy = jest
      .spyOn(logger, "info")
      .mockImplementation((message: any) => logger);
    logger.info("Test info message");
    expect(spy).toHaveBeenCalledWith("Test info message");
    spy.mockRestore();
  });

  it("should log warn messages", () => {
    const spy = jest
      .spyOn(logger, "warn")
      .mockImplementation((message: any) => logger);
    logger.warn("Test warn message");
    expect(spy).toHaveBeenCalledWith("Test warn message");
    spy.mockRestore();
  });

  it("should log error messages", () => {
    const spy = jest
      .spyOn(logger, "error")
      .mockImplementation((message: any) => logger);
    logger.error("Test error message");
    expect(spy).toHaveBeenCalledWith("Test error message");
    spy.mockRestore();
  });

  it("should have console and file transports", () => {
    const transportTypes = logger.transports.map((t) => t.constructor.name);
    expect(transportTypes).toContain("Console");
    expect(transportTypes).toContain("File");
  });

  it("should not exit on error", () => {
    expect(logger.exitOnError).toBe(false);
    logger.error("Test error message");
  });
});
