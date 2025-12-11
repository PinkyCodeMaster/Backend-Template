import "hono";
import type { Logger } from "pino";

declare module "hono" {
    interface ContextVariableMap {
        logger: Logger;
        clientInfo: {
            ip: string;
            userAgent?: string;
        };
        requestId: string;
    }
}
