import { timestamp } from "drizzle-orm/pg-core";

export const varcharLength = 256;

export const createdAt = timestamp("created_at").defaultNow().notNull();

export const updatedAt = timestamp("updated_at")
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull();
