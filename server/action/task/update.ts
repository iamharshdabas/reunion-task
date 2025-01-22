"use server";

import { errorMessage, successMessage } from "@/config/message";
import { TaskFormSchema, taskInsertSchema } from "@/schema/task";
import { updateTask } from "@/server/db/update";
import { auth } from "@clerk/nextjs/server";

export async function updateTaskAction(
  unsafeData: TaskFormSchema,
  taskId: string,
) {
  const { userId } = await auth();
  if (!userId) return { error: true, message: errorMessage.user.unauthorized };

  const { success, data } = taskInsertSchema.safeParse({
    ...unsafeData,
    userId,
  });
  if (!success) return { error: true, message: errorMessage.task.updated };

  const isUpdated = await updateTask(data, { userId, taskId });

  if (isUpdated) {
    return {
      success: true,
      message: successMessage.task.updated,
    };
  }

  return { error: true, message: errorMessage.task.updated };
}
