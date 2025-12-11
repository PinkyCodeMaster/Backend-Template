import { baseLogger } from "@/lib/logger";
import { pinoLogger } from "hono-pino";

export function requestLogger() {
  return pinoLogger({
    pino: baseLogger,
  });
}
