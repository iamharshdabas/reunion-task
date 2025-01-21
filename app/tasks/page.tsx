import PageWrapper from "@/components/layout/page-wrapper";
import NoTasks from "@/components/task/no-tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteHref } from "@/config/site";
import { TaskSelectSchema } from "@/schema/task";
import { getTasks } from "@/server/db/get";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const tasks = await getTasks(userId);

  if (tasks.length === 0) {
    return (
      <PageWrapper>
        <NoTasks />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      navChildren={
        <Button variant="secondary" asChild>
          <Link href={siteHref.taskNew()}>Create Task</Link>
        </Button>
      }
    >
      <TaskGrid tasks={tasks} />
    </PageWrapper>
  );
}

function TaskGrid({ tasks }: { tasks: TaskSelectSchema[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          {task.description && <CardContent>{task.description}</CardContent>}
        </Card>
      ))}
    </div>
  );
}
