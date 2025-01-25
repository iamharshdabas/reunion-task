import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { siteHref } from "@/config/site";
import {
  getNotCachedPriorityTasksTimeStats,
  getPriorityTasksStats,
  getTasksStats,
} from "@/server/db/get";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import PriorityCountChart from "./_components/chart/priority-count";
import PriorityTimeChart from "./_components/chart/priority-time";
import { Stats } from "@/components/ui/stats-section";
import { DashboardTaskSchema } from "@/schema/task";

const parseAndFormatFloat = (value: string, decimals: number = 1): number => {
  return parseFloat(parseFloat(value).toFixed(decimals));
};

const formatValue = (value: number) => {
  if (isNaN(value)) return 0;
  return value.toFixed(1);
};

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const tasksStats = await getTasksStats(userId);
  const priorityTasksStats = await getPriorityTasksStats(userId);
  const priorityTasksTimeStats =
    await getNotCachedPriorityTasksTimeStats(userId);
  const priority = priorityTasksStats.map((item, index) => ({
    ...item,
    ...priorityTasksTimeStats[index],
  }));
  const tasks: DashboardTaskSchema = {
    ...tasksStats,
    priority,
  };

  const formattedPriorityData = tasks.priority.map((item) => {
    const timeElapsed = parseAndFormatFloat(item.timeElapsed);
    const timeRemaining = parseAndFormatFloat(item.timeRemaining);

    return {
      ...item,
      timeElapsed,
      timeRemaining: timeRemaining < 0 ? 0 : timeRemaining,
    };
  });

  const totalTimeElapsed = formattedPriorityData.reduce(
    (acc, crr) => acc + crr.timeElapsed,
    0,
  );
  const totalTimeRemaining = formattedPriorityData.reduce(
    (acc, crr) => acc + crr.timeRemaining,
    0,
  );

  const formattedStats: { item: string; value: string }[] = [
    {
      item: "Total tasks",
      value: `${tasks.totalTasks} Tasks`,
    },
    {
      item: "Finished tasks",
      value: `${formatValue((tasks.totalFinishedTasks / tasks.totalTasks) * 100)}%`,
    },
    {
      item: "Pending tasks",
      value: `${formatValue((tasks.totalPendingTasks / tasks.totalTasks) * 100)}%`,
    },
    {
      item: "Average time",
      value: `${formatValue(tasks.totalFinishedTime / tasks.totalTasks)} Hours`,
    },
  ];

  const pendingStats: { item: string; value: string }[] = [
    {
      item: "Total time elapsed for pending tasks",
      value: `${formatValue(totalTimeElapsed)} Hours`,
    },
    {
      item: "Total time remaining for pending tasks",
      value: `${formatValue(totalTimeRemaining)} Hours`,
    },
  ];

  return (
    <PageWrapper
      navChildren={
        <Button variant="secondary" asChild>
          <Link href={siteHref.taskNew()}>Create Task</Link>
        </Button>
      }
    >
      <div className="space-y-4 lg:space-y-8">
        <Stats data={formattedStats} />
        <Stats
          data={pendingStats}
          component={<PriorityCountChart data={tasks.priority} />}
        />
        {tasks.totalTasks - tasks.totalFinishedTasks > 0 && (
          <PriorityTimeChart data={formattedPriorityData} />
        )}
      </div>
    </PageWrapper>
  );
}
