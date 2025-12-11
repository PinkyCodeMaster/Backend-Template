import { expand } from "dotenv-expand";
import { config } from "dotenv";
import path from "node:path";
import { z } from "zod";
import os from "node:os";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : process.env.NODE_ENV === "test"
        ? ".env.test"
        : ".env",
  ),
}));

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(9000),

  BASE_URL: z.string().url().optional(),

  APP_NAME: z.string().min(1).default("Foundry API"),
  APP_VERSION: z.string().default("0.1.0"),
  APP_SCHEME: z.string().default("foundry"),
  APP_WEB_URL: z.string().url().default("http://localhost:3000"),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),

  DATABASE_URL: z.string().nonempty(),
  FRONTEND_URL: z.string().url(),

  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16),

  RESEND_API_KEY: z.string().nonempty(),
  EMAIL_FROM: z.string().nonempty(),

  SENTRY_DSN: z.string().optional(),
  SENTRY_ENV: z.string().default("development"),
  SENTRY_RELEASE: z.string().default("local"),

  REDIS_URL: z.string().nonempty(),
});

export type Env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment configuration:");
  console.error(JSON.stringify(error.format(), null, 2));
  process.exit(1);
}

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  const candidates: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        candidates.push(iface.address);
      }
    }
  }

  const preferred = candidates.find(ip =>
    ip.startsWith("192.168.0.") ||
    ip.startsWith("192.168.1.") ||
    ip.startsWith("10.0.0.")
  );

  const selectedIP = preferred || candidates[0] || "localhost";

  if (candidates.length > 1) {
    console.log("Available network interfaces:", candidates);
    console.log(`Selected IP: ${selectedIP}`);
  }

  return selectedIP;
}

const baseUrl = env!.BASE_URL ||
  (env!.NODE_ENV === "production"
    ? "https://api.foundrystack.com"
    : `http://${getLocalIP()}:${env!.PORT}`);

export default {
  ...env!,
  BASE_URL: baseUrl,
};
