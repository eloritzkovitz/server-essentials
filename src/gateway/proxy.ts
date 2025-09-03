import { Application, Response } from "express-serve-static-core";
import httpProxy from "http-proxy";

/**
 * Registers proxy routes for microservices in the API gateway.
 * Accepts a config array for flexibility and reusability.
 *
 * @param app - The Express application instance.
 * @param proxy - The http-proxy instance.
 * @param routes - Array of route configs: { apiPath, target, rewritePrefix, serviceName }
 */
export function registerProxyRoutes(
  app: Application,
  proxy: httpProxy,
  routes: Array<{
    apiPath: string;
    target: string;
    rewritePrefix: string;
    serviceName: string;
  }>
) {
  /**
   * Handles errors from proxy requests and sends a 500 response.
   *
   * @param res - The Express response object.
   * @param serviceName - The name of the target service for logging.
   * @returns Error handler function for the proxy.
   */
  function handleProxyError(res: Response, serviceName: string) {
    return (err: { message: any }) => {
      console.error(
        `Error forwarding to ${serviceName} service: ${err.message}`
      );
      res.status(500).send("Internal Server Error");
    };
  }

  /**
   * Registers a single proxy route.
   * Rewrites the incoming API path to the service's route prefix and proxies the request.
   *
   * @param apiPath - The API gateway route.
   * @param target - The target service URL.
   * @param rewritePrefix - The prefix to rewrite the path to.
   * @param serviceName - The name of the service for logging.
   */
  routes.forEach(({ apiPath, target, rewritePrefix, serviceName }) => {
    app.use(apiPath, (req, res) => {
      req.url = req.originalUrl
        .replace(new RegExp(`^${apiPath}`), rewritePrefix)
        .replace(/\/{2,}/g, "/");
      proxy.web(req, res, { target }, handleProxyError(res, serviceName));
    });
  });
}
