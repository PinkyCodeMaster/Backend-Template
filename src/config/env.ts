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
  CORS_EXTRA_ORIGINS: z.string().optional(), // comma-delimited list

  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16),

  RESEND_API_KEY: z.string().nonempty(),
  EMAIL_FROM: z.string().nonempty(),

  SENTRY_DSN: z.string().optional(),
  SENTRY_ENV: z.string().default("development"),
  SENTRY_RELEASE: z.string().default("local"),

  REDIS_URL: z.string().nonempty(),

  RATE_LIMIT_GLOBAL_MAX: z.coerce.number().default(60),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().default(20),

  STORAGE_ENDPOINT: z.string().url().default("http://localhost:9002"),
  STORAGE_ACCESS_KEY: z.string().default("minioadmin"),
  STORAGE_SECRET_KEY: z.string().default("minioadmin"),
  STORAGE_BUCKET: z.string().default("foundry-bucket"),
  STORAGE_USE_SSL: z.coerce.boolean().default(false),

  INNGEST_EVENT_KEY: z.string().optional(),
});

type RawEnv = z.infer<typeof EnvSchema>;
export type Env = Omit<RawEnv, "CORS_EXTRA_ORIGINS" | "BASE_URL"> & {
  CORS_EXTRA_ORIGINS: string[];
  BASE_URL: string;
};

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

const extraOrigins = env!.CORS_EXTRA_ORIGINS
  ? env!.CORS_EXTRA_ORIGINS.split(",").map(o => o.trim()).filter(Boolean)
  : [];

const enrichedEnv: Env = {
  ...env!,
  BASE_URL: baseUrl,
  CORS_EXTRA_ORIGINS: extraOrigins,
};

export default enrichedEnv;
