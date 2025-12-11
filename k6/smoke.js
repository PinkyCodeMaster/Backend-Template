import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:9000";

export const options = {
  vus: Number(__ENV.VUS || 5),
  duration: __ENV.DURATION || "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const health = http.get(`${BASE_URL}/api/v1/health`);
  check(health, {
    "health is 200": (r) => r.status === 200,
    "health is ok": (r) => r.json("status") === "ok",
  });

  // Simple docs hit to ensure server responds
  const docs = http.get(`${BASE_URL}/docs`);
  check(docs, {
    "docs is 200": (r) => r.status === 200,
  });

  sleep(1);
}
