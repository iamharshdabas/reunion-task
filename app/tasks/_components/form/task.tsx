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
import {
  priorityEnum,
  priorityEnumDefault,
  statusEnumDefault,
  statusEnumObj,
} from "@/drizzle/schema";
import {
  taskFormSchema,
  TaskFormSchema,
  taskInsertSchema,
  TaskSelectSchema,
} from "@/schema/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";

type Props = {
  userId: string;
  cardTitle: string;
  task?: TaskSelectSchema;
};

export default function TaskForm({ userId, cardTitle, task }: Props) {
  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? { ...task, description: task.description || "" }
      : {
          title: "",
          description: "",
          priority: priorityEnumDefault,
          status: statusEnumDefault,
          startAt: new Date(),
          endAt: addDays(new Date(), 1),
        },
  });

  function onSubmit(data: TaskFormSchema) {
    const unsafeData = { ...data, userId };
    console.log(data);
    const { success, error } = taskInsertSchema.safeParse(unsafeData);
    console.log(success, error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
                <FormItem>
                  <FormLabel>Task finished?</FormLabel>
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
                      noPastDate={true}
                    />
                  </FormControl>
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
                      noPastDate={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
