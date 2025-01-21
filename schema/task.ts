import { priorityEnum, statusEnum, taskTable } from "@/drizzle/schema";
import { varcharLength } from "@/drizzle/schema/constants";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const taskSelectSchema = createSelectSchema(taskTable);
export const taskInsertSchema = createInsertSchema(taskTable);

export const taskFormSchema = taskInsertSchema
  .pick({
    title: true,
    description: true,
    priority: true,
    status: true,
    startAt: true,
    endAt: true,
  })
  .extend({
    title: z
      .string()
      .min(1, { message: "Title is Required" })
      .max(varcharLength, { message: "Title is too long" }),
    description: z.string().optional(),
    priority: z.enum(priorityEnum.enumValues),
    status: z.enum(statusEnum.enumValues),
    startAt: z
      .date()
      .min(new Date(), { message: "Start date can't be in the past" }),
    endAt: z
      .date()
      .min(new Date(), { message: "End date can't be in the past" }),
  });

export type TaskSelectSchema = z.infer<typeof taskSelectSchema>;
export type TaskInsertSchema = z.infer<typeof taskInsertSchema>;
export type TaskFormSchema = z.infer<typeof taskFormSchema>;
