import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt, varcharLength } from "./constants";

export const priorityEnumDefault = "1";
export const statusEnumObj = { pending: "pending", finished: "finished" };
export const statusEnumDefault = statusEnumObj.pending;
export const priorityEnum = pgEnum("priority", [
  priorityEnumDefault,
  "2",
  "3",
  "4",
  "5",
]);
export const statusEnum = pgEnum("status", [statusEnumDefault, "finished"]);

export const taskTable = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: varcharLength }).notNull(),

  title: varchar("title", { length: varcharLength }).notNull(),
  description: text("description"),

  priority: priorityEnum("priority").default(priorityEnumDefault).notNull(),
  status: statusEnum("status").default(statusEnumDefault).notNull(),

  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),

  createdAt,
  updatedAt,
});
