import { prometheus } from "@hono/prometheus";
import { createMiddleware } from "hono/factory";

// ✅ Creates default metrics:
// - http_requests_total
// - http_request_duration_seconds
// - process_cpu_seconds_total
// - nodejs event loop lag, memory, etc.

export const { printMetrics, registerMetrics, } = prometheus();

export const metricsMiddleware = createMiddleware(async (c, next) => {
    await next();
});
