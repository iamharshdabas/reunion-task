"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTaskAction } from "@/server/action/task/delete";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
};

export default function DeleteTask({ id }: Props) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  function deleteTask() {
    startDeleteTransition(async () => {
      const isDeleted = await deleteTaskAction(id);

      if (isDeleted.error) {
        toast.error(isDeleted.message);
      }
      if (isDeleted.success) {
        toast.success(isDeleted.message);
      }
    });
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Permanent Delete Task?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={deleteTask} disabled={isDeletePending}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
