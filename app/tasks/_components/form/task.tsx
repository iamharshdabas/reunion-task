"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { siteHref } from "@/config/site";
import {
  priorityEnum,
  priorityEnumDefault,
  statusEnumDefault,
  statusEnumObj,
} from "@/drizzle/schema";
import {
  taskFormSchema,
  TaskFormSchema,
  TaskSelectSchema,
} from "@/schema/task";
import { createTaskAction } from "@/server/action/task/create";
import { updateTaskAction } from "@/server/action/task/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  cardTitle: string;
  task?: TaskSelectSchema;
};

export default function TaskForm({ cardTitle, task }: Props) {
  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          ...task,
          description: task.description || "",
          startAt: new Date(task.startAt),
          endAt: new Date(task.endAt),
        }
      : {
          title: "",
          description: "",
          priority: priorityEnumDefault,
          status: statusEnumDefault,
          startAt: new Date(),
          endAt: addDays(new Date(), 1),
        },
  });

  async function onSubmit(data: TaskFormSchema) {
    if (task) {
      const updatedData = {
        ...data,
        endAt: data.status === statusEnumObj.finished ? new Date() : data.endAt,
      };
      const result = await updateTaskAction(updatedData, task.id);
      if (result?.error) toast.error(result.message);
      if (result.success) {
        toast.success(result.message);
        redirect(siteHref.tasks());
      }
    } else {
      const result = await createTaskAction(data);
      if (result?.error) toast.error(result.message);
      if (result.success) {
        toast.success(result.message);
        redirect(siteHref.tasks());
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task start date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChangeAction={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task end date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChangeAction={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select task priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorityEnum.enumValues.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex gap-2">
                  <FormLabel className="pt-3">Task finished?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={
                        field.value === statusEnumObj.finished ? true : false
                      }
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked
                            ? statusEnumObj.finished
                            : statusEnumObj.pending,
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
