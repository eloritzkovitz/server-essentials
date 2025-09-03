import { authenticate, requireRole } from "../../src/auth/authorization";
import config from "../../src/config/config";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

beforeAll(() => {
  process.env.TOKEN_SECRET = "testsecret";
  process.env.TOKEN_EXPIRES = "1h";
  process.env.REFRESH_TOKEN_EXPIRES = "7d";
});

describe("authenticate middleware", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { header: jest.fn().mockReturnValue(undefined) };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    process.env.TOKEN_SECRET = "testsecret";
    jest.restoreAllMocks();
  });

  it("denies access if no token", () => {
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Access Denied");
    expect(next).not.toHaveBeenCalled();
  });

  it("denies access if TOKEN_SECRET missing", () => {
    process.env.TOKEN_SECRET = "";
    const reqWithHeader = {
      header: jest.fn().mockReturnValue("Bearer sometoken"),
    } as any;
    authenticate(reqWithHeader, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Server Error");
    expect(next).not.toHaveBeenCalled();
    process.env.TOKEN_SECRET = "testsecret";
  });

  it("responds with 401 if JWT verification fails", () => {
    jest.spyOn(config.jwt, "secret", "get").mockReturnValue("testsecret");
    const reqWithToken = {
      header: jest.fn().mockReturnValue("Bearer faketoken"),
    } as any;
    (jwt.verify as jest.Mock).mockImplementation((_token, _secret, cb) => {
      cb(new Error("Invalid token"), null);
    });
    authenticate(reqWithToken, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Access Denied");
    expect(next).not.toHaveBeenCalled();
  });
});

describe("requireRole middleware", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("allows access for matching role", () => {
    req.user = { role: "admin" };
    const mw = requireRole("admin");
    mw(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("denies access for non-matching role", () => {
    req.user = { role: "user" };
    const mw = requireRole("admin");
    mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "admin access required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
