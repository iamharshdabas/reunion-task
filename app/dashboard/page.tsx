import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { siteHref } from "@/config/site";
import { getTasksStats } from "@/server/db/get";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { PriorityTimeChart } from "./_components/chart/priority-time";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const tasks = await getTasksStats(userId);

  console.log(tasks);

  const formattedPriorityData = tasks.priority.map((item) => {
    const timeElapsed = parseFloat(item.timeElapsed);
    const timeRemaining = parseFloat(item.timeRemaining);

    return {
      ...item,
      timeElapsed: parseFloat(timeElapsed.toFixed(1)),
      timeRemaining: parseFloat(timeRemaining.toFixed(1)),
    };
  });

  console.log(formattedPriorityData);

  return (
    <PageWrapper
      navChildren={
        <Button variant="secondary" asChild>
          <Link href={siteHref.taskNew()}>Create Task</Link>
        </Button>
      }
    >
      <PriorityTimeChart data={formattedPriorityData} />
    </PageWrapper>
  );
}
