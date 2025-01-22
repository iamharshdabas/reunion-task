"use server";

import { errorMessage, successMessage } from "@/config/message";
import { deleteTask } from "@/server/db/delete";
import { auth } from "@clerk/nextjs/server";

export async function deleteTaskAction(taskId: string) {
  const { userId } = await auth();
  if (!userId) return { error: true, message: errorMessage.user.unauthorized };

  const isDeleted = await deleteTask(userId, taskId);

  if (isDeleted) {
    return {
      success: true,
      message: successMessage.task.deleted,
    };
  }

  return { error: true, message: errorMessage.task.deleted };
}
