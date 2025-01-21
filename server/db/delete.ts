import { db } from "@/drizzle/db";
import { taskTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
  const deletedRows = await db
    .delete(taskTable)
    .where(eq(taskTable.userId, userId))
    .returning({ id: taskTable.id });

  // TODO: implement caching
  console.log(`Deleted ${deletedRows.length} tasks for user ${userId}`);
}
