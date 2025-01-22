import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getIdTag, getUserTag } from "@/lib/cache";
import { and, count, eq, sql, SQL } from "drizzle-orm";

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

export function getTasksStats(userId: string) {
  const cacheFn = dbCache(getNotCachedTasksStats, {
    tags: [getUserTag(userId, CACHE_TAGS.task)],
  });

  return cacheFn(userId);
}

export async function getNotCachedTasksStats(userId: string): Promise<{
  totalTasks: number;
  totalPendingTasks: number;
  totalFinishedTasks: number;
  totalFinishedTime: number;
  priority: {
    priority: "1" | "2" | "3" | "4" | "5";
    count: number;
    timeElapsed: string;
    timeRemaining: string;
  }[];
}> {
  const currentTimestamp = new Date().toISOString();

  const userTasks = db.$with("userTasks").as(
    db
      .select({
        id: taskTable.id,
        priority: taskTable.priority,
        status: taskTable.status,
        startAt: taskTable.startAt,
        endAt: taskTable.endAt,
      })
      .from(taskTable)
      .where(eq(taskTable.userId, userId)),
  );

  const stats = await db
    .with(userTasks)
    .select({
      totalTasks: count(userTasks.id),
      totalPendingTasks: count(
        sql`case when ${userTasks.status} = 'pending' then 1 end`,
      ),
      totalFinishedTasks: count(
        sql`case when ${userTasks.status} = 'finished' then 1 end`,
      ),
      totalFinishedTime: sql<number>`sum(
        case when ${userTasks.status} = 'finished' 
        then EXTRACT(epoch FROM (${userTasks.endAt} - ${userTasks.startAt})) / 3600
        end
      )`,
    })
    .from(userTasks);

  const groupedByPriority = await db
    .with(userTasks)
    .select({
      priority: userTasks.priority,
      count: count(userTasks.id),
      timeElapsed: sql<number>`sum(
        case when ${userTasks.status} = 'pending'
        then EXTRACT(epoch FROM (${sql`${currentTimestamp}`}::timestamp - ${userTasks.startAt})) / 3600
        end
      )`,
      timeRemaining: sql<number>`sum(
        case when ${userTasks.status} = 'pending'
        then EXTRACT(epoch FROM (${userTasks.endAt} - ${sql`${currentTimestamp}`}::timestamp)) / 3600
        end
      )`,
    })
    .from(userTasks)
    .groupBy(userTasks.priority);

  return {
    totalTasks: stats[0].totalTasks,
    totalPendingTasks: stats[0].totalPendingTasks,
    totalFinishedTasks: stats[0].totalFinishedTasks,
    totalFinishedTime: stats[0].totalFinishedTime,
    priority: groupedByPriority.map((item) => ({
      ...item,
      timeElapsed: item.timeElapsed ? item.timeElapsed.toString() : "0",
      timeRemaining: item.timeRemaining ? item.timeRemaining.toString() : " 0",
    })),
  };
}
