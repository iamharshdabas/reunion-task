import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createdAt, updatedAt, varcharLength } from "./constants";

export const priorityEnum = pgEnum("priority", ["1", "2", "3", "4", "5"]);

export const taskTable = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: varcharLength }).notNull(),

  title: varchar("title", { length: varcharLength }).notNull(),
  description: text("description"),

  priority: priorityEnum("priority").default("1"),
  status: varchar("status", { length: varcharLength }).notNull(),

  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),

  createdAt,
  updatedAt,
});

export const taskSelectSchema = createSelectSchema(taskTable);
export const taskInsertSchema = createInsertSchema(taskTable);
