import dotenv from "dotenv";
dotenv.config();

import { generateToken, verifyRefreshToken } from "../../src/auth/tokenService";
import jwt from "jsonwebtoken";

describe("generateToken", () => {
  beforeAll(() => {
    process.env.TOKEN_SECRET = "testsecret";
    process.env.TOKEN_EXPIRES = "1h";
    process.env.REFRESH_TOKEN_EXPIRES = "7d";
  });

  it("generates access and refresh tokens", () => {
    const tokens = generateToken("user123", "admin");
    expect(tokens).toHaveProperty("accessToken");
    expect(tokens).toHaveProperty("refreshToken");
    expect(typeof tokens?.accessToken).toBe("string");
    expect(typeof tokens?.refreshToken).toBe("string");
  });

  it("role is optional", () => {
    const tokens = generateToken("user123");
    expect(tokens).toHaveProperty("accessToken");
    expect(tokens).toHaveProperty("refreshToken");
  });

  it("returns null if secret is missing", () => {
    const originalSecret = process.env.TOKEN_SECRET;
    process.env.TOKEN_SECRET = "";
    jest.resetModules();
    const {
      generateToken: freshGenerateToken,
    } = require("../../src/auth/tokenService");
    expect(freshGenerateToken("user123", "admin")).toBeNull();
    process.env.TOKEN_SECRET = originalSecret;
  });

  it("returns null if userId is missing", () => {
    // @ts-expect-error
    const tokens = generateToken();
    expect(tokens).toBeNull();
  });
});

describe("verifyRefreshToken", () => {
  it("rejects if refreshToken is undefined", async () => {
    await expect(verifyRefreshToken(undefined, {})).rejects.toBe(
      "Refresh token is required"
    );
  });

  it("rejects if secret is missing", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    process.env.TOKEN_SECRET = "";
    jest.resetModules();
    const {
      verifyRefreshToken: freshVerifyRefreshToken,
    } = require("../../src/auth/tokenService");
    await expect(freshVerifyRefreshToken("sometoken", {})).rejects.toBe(
      "Token secret is missing"
    );
    process.env.TOKEN_SECRET = originalSecret;
  });

  it("rejects if jwt.verify fails", async () => {
    jest
      .spyOn(require("jsonwebtoken"), "verify")
      .mockImplementation((token, secret, cb) =>
        (cb as Function)("fail", null)
      );
    await expect(verifyRefreshToken("badtoken", {})).rejects.toBe("fail");
    jest.restoreAllMocks();
  });

  it("rejects if user not found", async () => {
    const userModel = { findById: jest.fn().mockResolvedValue(null) };
    jest
      .spyOn(require("jsonwebtoken"), "verify")
      .mockImplementation((token, secret, cb) =>
        (cb as Function)(null, { _id: "user123" })
      );
    await expect(verifyRefreshToken("token", userModel)).rejects.toBe("fail");
    jest.restoreAllMocks();
  });

  it("rejects if user.refreshToken is missing or does not include token", async () => {
    const user = {
      refreshToken: [],
      save: jest.fn().mockResolvedValue(undefined),
    };
    const userModel = { findById: jest.fn().mockResolvedValue(user) };
    jest
      .spyOn(require("jsonwebtoken"), "verify")
      .mockImplementation((token, secret, cb) =>
        (cb as Function)(null, { _id: "user123" })
      );
    await expect(verifyRefreshToken("token", userModel)).rejects.toBe("fail");
    jest.restoreAllMocks();
  });

  it("resolves with user if refreshToken is valid", async () => {
    const user: any = {
      refreshToken: ["token"],
      save: function (this: any) {
        return Promise.resolve(this);
      },
    };

    const userModel = { findById: jest.fn().mockResolvedValue(user) };
    jest
      .spyOn(jwt, "verify")
      .mockImplementation((_token, _secret, cb) =>
        (cb as Function)(null, { _id: "user123" })
      );

    await expect(verifyRefreshToken("token", userModel)).resolves.toBe(user);

    jest.restoreAllMocks();
  });

  it("rejects if user.save throws", async () => {
    const user = {
      refreshToken: [],
      save: jest.fn().mockRejectedValue(new Error("fail")),
    };
    const userModel = { findById: jest.fn().mockResolvedValue(user) };
    jest
      .spyOn(require("jsonwebtoken"), "verify")
      .mockImplementation((token, secret, cb) =>
        (cb as Function)(null, { _id: "user123" })
      );
    await expect(verifyRefreshToken("token", userModel)).rejects.toBe("fail");
    jest.restoreAllMocks();
  });
});
