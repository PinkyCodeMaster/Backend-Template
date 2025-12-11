import fs from "node:fs";
import path from "node:path";

// Provide safe defaults so env parsing works even if .env is missing
process.env.NODE_ENV ??= "development";
process.env.DATABASE_URL ??= "postgresql://user:password@localhost:5432/foundry";
process.env.FRONTEND_URL ??= "http://localhost:3000";
process.env.BETTER_AUTH_URL ??= "http://localhost:9000";
process.env.BETTER_AUTH_SECRET ??= "CHANGE_ME_SUPER_SECRET";
process.env.RESEND_API_KEY ??= "CHANGE_ME";
process.env.EMAIL_FROM ??= "Foundry <no-reply@localhost>";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.STORAGE_ENDPOINT ??= "http://localhost:9002";
process.env.STORAGE_ACCESS_KEY ??= "minioadmin";
process.env.STORAGE_SECRET_KEY ??= "minioadmin";

import env from "@/config/env";
import { app } from "@/app/app";

const outDir = path.resolve("docs");
const outFile = path.join(outDir, "openapi.json");

const document = app.getOpenAPIDocument({
  openapi: "3.0.0",
  info: {
    title: `${env.APP_NAME} API`,
    version: env.APP_VERSION,
  },
  servers: [
    {
      url: env.BASE_URL,
      description: env.NODE_ENV,
    },
  ],
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(document, null, 2));

console.log(`OpenAPI spec written to ${outFile}`);
console.log(`Title: ${document.info?.title}`);
