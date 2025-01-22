import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { TaskInsertSchema } from "@/schema/task";

export async function createTask(data: TaskInsertSchema) {
  const [createdTask] = await db
    .insert(taskTable)
    .values(data)
    .returning({ id: taskTable.id });

  revalidateDbCache({
    tag: CACHE_TAGS.task,
    userId: data.userId,
    id: createdTask.id,
  });

  return createdTask;
}
