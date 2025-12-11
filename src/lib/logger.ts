import pretty from "pino-pretty";
import env from "@/config/env";
import pino from "pino";

export const baseLogger = pino(
  { level: env.LOG_LEVEL },
  env.NODE_ENV === "production" ? undefined : pretty()
);
