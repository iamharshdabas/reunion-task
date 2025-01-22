import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { siteHref } from "@/config/site";
import { getTasksStats } from "@/server/db/get";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import PriorityCountChart from "./_components/chart/priority-count";
import PriorityTimeChart from "./_components/chart/priority-time";
import { Stats } from "@/components/ui/stats-section";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const tasks = await getTasksStats(userId);

  const formattedPriorityData = tasks.priority.map((item) => {
    const timeElapsed = parseFloat(item.timeElapsed);
    const timeRemaining = parseFloat(item.timeRemaining);

    return {
      ...item,
      timeElapsed: parseFloat(timeElapsed.toFixed(1)),
      timeRemaining: parseFloat(timeRemaining.toFixed(1)),
    };
  });

  const formattedStats: { item: string; value: string }[] = [
    {
      item: "Total Tasks",
      value: `${tasks.totalTasks} Tasks`,
    },
    {
      item: "Finished Tasks",
      value: `${(tasks.totalFinishedTime / tasks.totalTasks) * 100}%`,
    },
    {
      item: "Pending Tasks",
      value: `${(tasks.totalPendingTasks / tasks.totalTasks) * 100}%`,
    },
    {
      item: "Average Time",
      value: `${tasks.totalFinishedTime / tasks.totalTasks} Hours`,
    },
  ];

  const totalTimeElapsed = formattedPriorityData.reduce(
    (acc, crr) => acc + crr.timeElapsed,
    0,
  );
  const totalTimeRemaining = formattedPriorityData.reduce(
    (acc, crr) => acc + crr.timeRemaining,
    0,
  );

  const pendingStats: { item: string; value: string }[] = [
    {
      item: "Total Time Elapsed",
      value: `${totalTimeElapsed} Hours`,
    },
    {
      item: "Total Time Remaining",
      value: `${totalTimeRemaining} Hours`,
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
        <PriorityTimeChart data={formattedPriorityData} />
      </div>
    </PageWrapper>
  );
}
