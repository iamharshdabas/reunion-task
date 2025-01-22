import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getIdTag, getUserTag } from "@/lib/cache";
import { and, eq, SQL } from "drizzle-orm";

export function getTasks(userId: string, orderBy?: SQL[], where?: SQL[]) {
  const cacheFn = dbCache(getNotCachedTasks, {
    tags: [getUserTag(userId, CACHE_TAGS.task)],
  });

  return cacheFn(userId, orderBy, where);
}

export async function getNotCachedTasks(
  userId: string,
  orderBy: SQL[] = [],
  where: SQL[] = [],
) {
  return await db.query.taskTable.findMany({
    orderBy: [...orderBy],
    where: and(eq(taskTable.userId, userId), ...where),
  });
}

export function getTask(userId: string, taskId: string) {
  const cacheFn = dbCache(getNotCachedTask, {
    tags: [getIdTag(taskId, CACHE_TAGS.task)],
  });

  return cacheFn(userId, taskId);
}

async function getNotCachedTask(userId: string, taskId: string) {
  return await db.query.taskTable.findFirst({
    where: and(eq(taskTable.userId, userId), eq(taskTable.id, taskId)),
  });
}
