import { describe, it, expect, beforeEach, vi } from "vitest";
import { registerProxyRoutes } from "../../src/gateway/proxy";

describe("registerProxyRoutes", () => {
  let app: any;
  let proxy: any;

  beforeEach(() => {
    app = { use: vi.fn() };
    proxy = {
      web: vi.fn(),
    };
  });

  it("registers proxy routes for each config", () => {
    const routes = [
      {
        apiPath: "/api/service1",
        target: "http://service1.local",
        rewritePrefix: "/",
        serviceName: "service1",
      },
      {
        apiPath: "/api/service2",
        target: "http://service2.local",
        rewritePrefix: "/v2",
        serviceName: "service2",
      },
    ];

    registerProxyRoutes(app, proxy, routes);

    expect(app.use).toHaveBeenCalledTimes(2);

    const [apiPath, handler] = app.use.mock.calls[0];
    expect(apiPath).toBe("/api/service1");

    const req = {
      originalUrl: "/api/service1/foo/bar",
      url: "",
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    proxy.web.mockImplementation(
      (reqArg: any, resArg: any, opts: any, cb: (err?: any) => void) => {
        cb({ message: "proxy error" });
      },
    );

    handler(req, res);

    expect(req.url).toBe("/foo/bar");

    expect(proxy.web).toHaveBeenCalledWith(
      req,
      res,
      { target: "http://service1.local" },
      expect.any(Function),
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal Server Error");
  });

  it("rewrites path using rewritePrefix", () => {
    const routes = [
      {
        apiPath: "/api/test",
        target: "http://test.local",
        rewritePrefix: "/v1",
        serviceName: "test",
      },
    ];

    registerProxyRoutes(app, proxy, routes);

    const [apiPath, handler] = app.use.mock.calls[0];
    const req = {
      originalUrl: "/api/test/abc",
      url: "",
    };
    const res = {};

    handler(req, res);

    expect(req.url).toBe("/v1/abc");
  });
});
