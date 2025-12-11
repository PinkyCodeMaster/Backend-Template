import env from "@/config/env";
import { app } from "@/app/app";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function hasMinimumSecrets() {
  assert(env.BETTER_AUTH_SECRET.length >= 16, "BETTER_AUTH_SECRET too short");
  assert(!!env.RESEND_API_KEY, "RESEND_API_KEY missing");
  assert(!!env.EMAIL_FROM, "EMAIL_FROM missing");
  assert(!!env.DATABASE_URL, "DATABASE_URL missing");
}

function checkOpenAPISecurity() {
  const doc = app.getOpenAPIDocument({
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
  const securitySchemes = doc.components?.securitySchemes ?? {};
  assert(
    "BearerAuth" in securitySchemes,
    "BearerAuth security scheme not registered in OpenAPI document"
  );
}

function main() {
  hasMinimumSecrets();
  checkOpenAPISecurity();
  console.log("Auth contract check passed.");
}

main();
