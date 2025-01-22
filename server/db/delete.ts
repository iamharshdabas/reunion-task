import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
  const deletedRows = await db
    .delete(taskTable)
    .where(eq(taskTable.userId, userId))
    .returning({ id: taskTable.id });

  deletedRows.forEach(({ id }) => {
    revalidateDbCache({
      tag: CACHE_TAGS.task,
      userId,
      id,
    });
  });

  return deletedRows.length >= 1;
}

export async function deleteTask(userId: string, taskId: string) {
  const deletedRows = await db
    .delete(taskTable)
    .where(and(eq(taskTable.userId, userId), eq(taskTable.id, taskId)))
    .returning({ id: taskTable.id });

  deletedRows.forEach(({ id }) => {
    revalidateDbCache({
      tag: CACHE_TAGS.task,
      userId,
      id,
    });
  });

  return deletedRows.length >= 1;
}
