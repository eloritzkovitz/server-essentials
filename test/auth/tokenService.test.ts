import dotenv from "dotenv";
dotenv.config();

import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  generateToken,
  verifyRefreshToken,
} from "../../src/auth/tokenService.js";
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

  it("returns null if secret is missing", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    process.env.TOKEN_SECRET = "";

    vi.resetModules();

    const { generateToken: freshGenerateToken } =
      await import("../../src/auth/tokenService.js");

    expect(freshGenerateToken("user123", "admin")).toBeNull();

    process.env.TOKEN_SECRET = originalSecret;
    vi.resetModules();
  });

  it("returns null if userId is missing", () => {
    // @ts-expect-error testing missing runtime argument
    const tokens = generateToken();
    expect(tokens).toBeNull();
  });
});

describe("verifyRefreshToken", () => {
  it("rejects if refreshToken is undefined", async () => {
    await expect(verifyRefreshToken(undefined, {})).rejects.toBe(
      "Refresh token is required",
    );
  });

  it("rejects if secret is missing", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    process.env.TOKEN_SECRET = "";

    vi.resetModules();
    const { verifyRefreshToken: freshVerifyRefreshToken } =
      await import("../../src/auth/tokenService.js");

    await expect(freshVerifyRefreshToken("sometoken", {})).rejects.toBe(
      "Token secret is missing",
    );

    process.env.TOKEN_SECRET = originalSecret;
    vi.resetModules();
  });

  it("rejects if jwt.verify fails", async () => {
    vi.spyOn(jwt, "verify").mockImplementation(
      (_token: any, _secret: any, cb: any) => cb("fail", null),
    );
    await expect(verifyRefreshToken("badtoken", {})).rejects.toBe("fail");
    vi.restoreAllMocks();
  });

  it("rejects if user not found", async () => {
    const userModel = {
      findById: vi.fn<() => Promise<any>>().mockResolvedValue(null),
    };
    vi.spyOn(jwt, "verify").mockImplementation(
      (_token: any, _secret: any, cb: any) => cb(null, { _id: "user123" }),
    );
    await expect(verifyRefreshToken("token", userModel)).rejects.toBe("fail");
    vi.restoreAllMocks();
  });

  it("rejects if user.refreshToken is missing or does not include token", async () => {
    const user = {
      refreshToken: [],
      save: vi.fn<() => Promise<any>>().mockResolvedValue(undefined),
    };
    const userModel = {
      findById: vi.fn<() => Promise<any>>().mockResolvedValue(user),
    };
    vi.spyOn(jwt, "verify").mockImplementation(
      (_token: any, _secret: any, cb: any) => cb(null, { _id: "user123" }),
    );
    await expect(verifyRefreshToken("token", userModel)).rejects.toBe("fail");
    vi.restoreAllMocks();
  });

  it("resolves with user if refreshToken is valid", async () => {
    const user: any = {
      refreshToken: ["token"],
      save: function (this: any) {
        return Promise.resolve(this);
      },
    };

    const userModel = {
      findById: vi.fn<() => Promise<any>>().mockResolvedValue(user),
    };
    vi.spyOn(jwt, "verify").mockImplementation(
      (_token: any, _secret: any, cb: any) => cb(null, { _id: "user123" }),
    );

    await expect(verifyRefreshToken("token", userModel)).resolves.toBe(user);

    vi.restoreAllMocks();
  });

  it("rejects if user.save throws", async () => {
    const user = {
      refreshToken: [],
      save: vi.fn<() => Promise<any>>().mockRejectedValue(new Error("fail")),
    };
    const userModel = {
      findById: vi.fn<() => Promise<any>>().mockResolvedValue(user),
    };
    vi.spyOn(jwt, "verify").mockImplementation(
      (_token: any, _secret: any, cb: any) => cb(null, { _id: "user123" }),
    );
    await expect(verifyRefreshToken("token", userModel)).rejects.toBe("fail");
    vi.restoreAllMocks();
  });
});
