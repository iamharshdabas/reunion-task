import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { eq } from "drizzle-orm";

export function getTasks(userId: string) {
  const cacheFn = dbCache(getNotCachedTasks, {
    tags: [getUserTag(userId, CACHE_TAGS.task)],
  });

  return cacheFn(userId);
}

async function getNotCachedTasks(userId: string) {
  return await db.query.taskTable.findMany({
    where: eq(taskTable.userId, userId),
  });
}
