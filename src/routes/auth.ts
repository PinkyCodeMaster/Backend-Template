import { auth } from "@/lib/auth";
import { Hono } from "hono";

const authentication = new Hono();

authentication.on(["POST", "GET"], "/*", async (c) => {
    const res = await auth.handler(c.req.raw);

    const cloned = res.clone();
    const text = await cloned.text();

    console.log("🧠 Better Auth Raw Response:", {
        status: res.status,
        body: text,
        headers: Object.fromEntries(res.headers.entries()),
    });

    return res;
});


export { authentication };
