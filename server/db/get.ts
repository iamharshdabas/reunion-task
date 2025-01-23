import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getIdTag, getUserTag } from "@/lib/cache";
import { and, count, eq, sql, SQL } from "drizzle-orm";

export function getTasks(
  userId: string,
  limit: number,
  page: number,
  orderBy?: SQL[],
  where?: SQL[],
) {
  const cacheFn = dbCache(getNotCachedTasks, {
    tags: [getUserTag(userId, CACHE_TAGS.task)],
  });

  return cacheFn(userId, limit, page, orderBy, where);
}

export async function getNotCachedTasks(
  userId: string,
  limit: number,
  page: number,
  orderBy: SQL[] = [],
  where: SQL[] = [],
) {
  const data = await db
    .select({
      record: taskTable,
      count: sql<number>`count(*) over()`,
    })
    .from(taskTable)
    .where(and(eq(taskTable.userId, userId), ...where))
    .orderBy(...orderBy)
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    count: data[0]?.count ?? 0,
    paginatedTasks: data.map((item) => item.record),
  };
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
}> {
  const userTasks = getUserTasksSubQuery(userId);

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
      totalFinishedTime: sql<number>`sum(case when ${userTasks.status} = 'finished' then EXTRACT(epoch FROM (${userTasks.endAt} - ${userTasks.startAt})) / 3600 end)`,
    })
    .from(userTasks);

  return {
    totalTasks: stats[0].totalTasks,
    totalPendingTasks: stats[0].totalPendingTasks,
    totalFinishedTasks: stats[0].totalFinishedTasks,
    totalFinishedTime: stats[0].totalFinishedTime,
  };
}

export function getPriorityTasksStats(userId: string) {
  const cacheFn = dbCache(getNotCachedPriorityTasksStats, {
    tags: [getUserTag(userId, CACHE_TAGS.task)],
  });

  return cacheFn(userId);
}

async function getNotCachedPriorityTasksStats(userId: string): Promise<
  {
    priority: "1" | "2" | "3" | "4" | "5";
    count: number;
  }[]
> {
  const userTasks = getUserTasksSubQuery(userId);

  return await db
    .with(userTasks)
    .select({
      priority: userTasks.priority,
      count: count(userTasks.id),
    })
    .from(userTasks)
    .groupBy(userTasks.priority);
}

export async function getNotCachedPriorityTasksTimeStats(
  userId: string,
): Promise<
  {
    timeElapsed: string;
    timeRemaining: string;
  }[]
> {
  const currentTimestamp = new Date().toISOString();
  const userTasks = getUserTasksSubQuery(userId);

  const groupedByPriority = await db
    .with(userTasks)
    .select({
      timeElapsed: sql<number>`sum(case when ${userTasks.status} = 'pending' then EXTRACT(epoch FROM (${sql`${currentTimestamp}`}::timestamp - ${userTasks.startAt})) / 3600 end)`,
      timeRemaining: sql<number>`sum(case when ${userTasks.status} = 'pending' then EXTRACT(epoch FROM (${userTasks.endAt} - ${sql`${currentTimestamp}`}::timestamp)) / 3600 end)`,
    })
    .from(userTasks)
    .groupBy(userTasks.priority);

  return groupedByPriority.map((item) => ({
    timeElapsed: item.timeElapsed ? item.timeElapsed.toString() : "0",
    timeRemaining: item.timeRemaining ? item.timeRemaining.toString() : " 0",
  }));
}

function getUserTasksSubQuery(userId: string) {
  return db.$with("userTasks").as(
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
}
