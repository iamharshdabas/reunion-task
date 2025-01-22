import PageWrapper from "@/components/layout/page-wrapper";
import { auth } from "@clerk/nextjs/server";
import TaskForm from "../../_components/form/task";
import { getTask } from "@/server/db/get";
import NoTasks from "@/components/task/no-tasks";

export default async function Page({ params }: { params: { taskId: string } }) {
  const { taskId } = await params;
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const task = await getTask(userId, taskId);
  if (!task) {
    return (
      <PageWrapper>
        <NoTasks />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TaskForm cardTitle="Edit task" task={task} />
    </PageWrapper>
  );
}
