"use server";

import { errorMessage, successMessage } from "@/config/message";
import { TaskFormSchema, taskInsertSchema } from "@/schema/task";
import { createTask } from "@/server/db/create";
import { auth } from "@clerk/nextjs/server";

export async function createTaskAction(unsafeData: TaskFormSchema) {
  const { userId } = await auth();
  if (!userId) return { error: true, message: errorMessage.user.unauthorized };

  const { success, data } = taskInsertSchema.safeParse({
    ...unsafeData,
    userId,
  });

  if (!success) return { error: true, message: errorMessage.task.created };

  const task = await createTask(data);

  if (task.id) {
    return {
      success: true,
      message: successMessage.task.created,
      id: task.id,
    };
  }

  return { error: true, message: errorMessage.task.created };
}
