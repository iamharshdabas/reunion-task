import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { TaskInsertSchema } from "@/schema/task";
import { and, eq } from "drizzle-orm";

export async function updateTask(
  data: TaskInsertSchema,
  { userId, taskId }: { userId: string; taskId: string },
) {
  const { rowCount } = await db
    .update(taskTable)
    .set(data)
    .where(and(eq(taskTable.userId, userId), eq(taskTable.id, taskId)));

  if (rowCount === 1) {
    revalidateDbCache({
      tag: CACHE_TAGS.task,
      userId: userId,
      id: taskId,
    });
  }

  return rowCount === 1;
}
