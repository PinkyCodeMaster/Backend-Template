import { Inngest } from "inngest";
import env from "@/config/env";

export const inngest = new Inngest({
  id: env.APP_NAME.toLowerCase().replace(/\s+/g, "-"),
  eventKey: env.INNGEST_EVENT_KEY,
});

export async function enqueueEvent<TData extends Record<string, unknown>>(params: {
  name: string;
  data: TData;
}) {
  if (!env.INNGEST_EVENT_KEY) {
    throw new Error("INNGEST_EVENT_KEY is not set; cannot enqueue events");
  }

  return inngest.send({
    name: params.name,
    data: params.data,
  });
}
