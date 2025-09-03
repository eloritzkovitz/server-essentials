import { registerProxyRoutes } from "../../src/gateway/proxy";

describe("registerProxyRoutes", () => {
  let app: any;
  let proxy: any;

  beforeEach(() => {
    app = { use: jest.fn() };
    proxy = {
      web: jest.fn(),
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

    // Test the handler for the first route
    const [apiPath, handler] = app.use.mock.calls[0];
    expect(apiPath).toBe("/api/service1");

    // Mock req/res for handler
    const req = {
      originalUrl: "/api/service1/foo/bar",
      url: "",
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Simulate proxy.web call and error handler
    proxy.web.mockImplementation(
      (
        reqArg: any,
        resArg: any,
        opts: any,
        cb: (err?: any) => void
      ) => {
        cb({ message: "proxy error" });
      }
    );

    handler(req, res);

    // url should be rewritten
    expect(req.url).toBe("/foo/bar");

    // proxy.web should be called with correct args
    expect(proxy.web).toHaveBeenCalledWith(
      req,
      res,
      { target: "http://service1.local" },
      expect.any(Function)
    );

    // Error handler should send 500
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
