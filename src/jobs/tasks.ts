import { inngest } from "@/lib/queue";

// Example job handler for task events.
// Wire this into your Inngest handler server when ready.
export const taskCreated = inngest.createFunction(
  { id: "task-created" },
  { event: "task/created" },
  async ({ event, step }) => {
    await step.run("log-task", async () => {
      console.log("Task created event received", {
        taskId: event.data.id,
        userId: event.data.userId,
        title: event.data.title,
      });
    });
  }
);

export const taskCompleted = inngest.createFunction(
  { id: "task-completed" },
  { event: "task/completed" },
  async ({ event, step }) => {
    await step.run("log-task-completed", async () => {
      console.log("Task completed event received", {
        taskId: event.data.id,
        userId: event.data.userId,
      });
    });
  }
);
