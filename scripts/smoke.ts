// Simple smoke tests that run in-process against the Hono app.
import "@/lib/sentry"; // ensure env parsing and Sentry init side effects
import env from "@/config/env";
import { app } from "@/app/app";

async function expectStatus(path: string, expected: number) {
  const res = await app.request(path);
  if (res.status !== expected) {
    throw new Error(`Expected ${path} to return ${expected}, got ${res.status}`);
  }
  return res;
}

async function main() {
  console.log("Running smoke tests against in-process app...");

  // Health
  const healthRes = await expectStatus("/api/v1/health", 200);
  const healthJson = await healthRes.json();
  if (healthJson.status !== "ok") {
    throw new Error("Health status not ok");
  }

  // Docs emitted?
  const docsRes = await expectStatus("/docs", 200);
  const docsJson = await docsRes.json();
  if (!docsJson.openapi || !docsJson.info?.title) {
    throw new Error("Docs missing openapi/info");
  }

  console.log("Smoke tests passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
