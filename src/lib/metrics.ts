import { prometheus } from "@hono/prometheus";

// Exposes default Prometheus metrics:
// - http_requests_total
// - http_request_duration_seconds
// - process metrics (CPU, memory, event loop)
export const { printMetrics, registerMetrics } = prometheus();
