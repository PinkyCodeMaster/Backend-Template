import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull().default("pending"),
    archived: boolean("archived").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("task_user_id_idx").on(table.userId)],
);
