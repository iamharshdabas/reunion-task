import PageWrapper from "@/components/layout/page-wrapper";
import { auth } from "@clerk/nextjs/server";
import TaskForm from "../_components/form/task";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <PageWrapper>
      <TaskForm cardTitle="Create new task" />
    </PageWrapper>
  );
}
