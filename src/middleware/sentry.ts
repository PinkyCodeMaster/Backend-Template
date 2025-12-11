import type { MiddlewareHandler } from "hono";
import { Sentry } from "@/lib/sentry";

export const sentryMiddleware: MiddlewareHandler = async (c, next) => {
    Sentry.setContext("request", {
        method: c.req.method,
        url: c.req.url,
        headers: Object.fromEntries(c.req.raw.headers),
    });

    await next();
};
