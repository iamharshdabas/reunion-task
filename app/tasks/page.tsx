import PageWrapper from "@/components/layout/page-wrapper";
import NoTasks from "@/components/task/no-tasks";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createURL, siteHref } from "@/config/site";
import {
  priorityEnum,
  statusEnum,
  statusEnumObj,
  taskTable,
} from "@/drizzle/schema";
import { TaskSelectSchema } from "@/schema/task";
import { getNotCachedTasks } from "@/server/db/get";
import { auth } from "@clerk/nextjs/server";
import { formatRelative } from "date-fns";
import { asc, desc, eq } from "drizzle-orm";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import CountdownTimer from "./_components/countdown-timer";
import DeleteTask from "./_components/delete-task";
import { title } from "@/config/class-variants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SearchParams = {
  priority: "1" | "2" | "3" | "4" | "5";
  status: "pending" | "finished";
  priorityOrder: "asc" | "desc";
  startAtOrder: "asc" | "desc";
  endAtOrder: "asc" | "desc";
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const awaitedSearchParams = await searchParams;
  const orderBy = createOrderByFromSearchParams(awaitedSearchParams);
  const where = createWhereFromSearchParams(awaitedSearchParams);

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const tasks = await getNotCachedTasks(userId, orderBy, where);

  if (tasks.length === 0) {
    return (
      <PageWrapper>
        <FilterAndOrder searchParams={awaitedSearchParams} />
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
      <div className="space-y-4 lg:space-y-8">
        <FilterAndOrder searchParams={awaitedSearchParams} />
        <TaskGrid tasks={tasks} />
      </div>
    </PageWrapper>
  );
}

function TaskGrid({ tasks }: { tasks: TaskSelectSchema[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
      {tasks.map((task) => (
        <Card key={task.id}>
          <DropdownMenu>
            <AlertDialog>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4">
                  <span className="text-balance">{task.title}</span>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      className="flex-shrink-0"
                      variant="outline"
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                </CardTitle>
                <CardDescription>{task.id}</CardDescription>
              </CardHeader>
              {task.description && (
                <CardContent>{task.description}</CardContent>
              )}

              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={siteHref.taskEdit(task.id)}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild></DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialogTrigger className="w-full">
                    Delete
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>

              <DeleteTask id={task.id} />

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        task.status === statusEnumObj.pending
                          ? "destructive"
                          : "outline"
                      }
                    >
                      <span className="uppercase font-semibold">
                        {task.status}
                      </span>
                    </Badge>
                    <span className={title({ size: "xs", bold: true })}>
                      {
                        <CountdownTimer
                          finished={task.status === statusEnumObj.finished}
                          startAt={task.startAt}
                          endAt={task.endAt}
                        />
                      }
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="uppercase">
                          {task.priority}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>priority</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <div className="flex gap-2 items-center">
                    <p className={title({ size: "sm" })}>From:</p>
                    <span>{formatRelative(task.startAt, new Date())}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className={title({ size: "sm" })}>To:</p>
                    <span>{formatRelative(task.endAt, new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </AlertDialog>
          </DropdownMenu>
        </Card>
      ))}
    </div>
  );
}

function createWhereFromSearchParams({ status, priority }: SearchParams) {
  const where = [];

  if (status) {
    where.push(eq(taskTable.status, status));
  }
  if (priority) {
    where.push(eq(taskTable.priority, priority));
  }

  return where;
}

function createOrderByFromSearchParams({
  priorityOrder,
  startAtOrder: startAt,
  endAtOrder: endAt,
}: SearchParams) {
  const orderBy = [];

  switch (priorityOrder) {
    case "asc":
      orderBy.push(asc(taskTable.priority));
      break;
    case "desc":
      orderBy.push(desc(taskTable.priority));
      break;
  }

  switch (startAt) {
    case "asc":
      orderBy.push(asc(taskTable.startAt));
      break;
    case "desc":
      orderBy.push(desc(taskTable.startAt));
      break;
  }

  switch (endAt) {
    case "asc":
      orderBy.push(asc(taskTable.endAt));
      break;
    case "desc":
      orderBy.push(desc(taskTable.endAt));
      break;
  }

  return orderBy;
}

function FilterAndOrder({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="grid gap-4 lg:gap-8 grid-cols-3 sm:grid-cols-5">
      {/* Priority Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {searchParams.priority
              ? `Priority: ${searchParams.priority}`
              : "Select priority"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {priorityEnum.enumValues.map((value) => (
            <DropdownMenuItem key={value} asChild>
              <Link
                href={createURL(siteHref.tasks(), searchParams, {
                  priority: value,
                })}
              >
                {`Priority ${value}`}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                priority: undefined,
              })}
              className="text-destructive-foreground bg-destructive"
            >
              Clear filter
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {searchParams.status
              ? `Status: ${searchParams.status}`
              : "Select status"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusEnum.enumValues.map((value) => (
            <DropdownMenuItem key={value} asChild>
              <Link
                href={createURL(siteHref.tasks(), searchParams, {
                  status: value,
                })}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                status: undefined,
              })}
              className="text-destructive-foreground bg-destructive"
            >
              Clear filter
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Order By Priority */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {searchParams.priorityOrder
              ? `Priority: ${searchParams.priorityOrder}`
              : "Sort priority"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                priorityOrder: "asc",
              })}
            >
              Ascending
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                priorityOrder: "desc",
              })}
            >
              Descending
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                priorityOrder: undefined,
              })}
              className="text-destructive-foreground bg-destructive"
            >
              Clear sort
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Order by Start At */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {searchParams.startAtOrder
              ? `Start at: ${searchParams.startAtOrder}`
              : "Sort start date"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                startAtOrder: "asc",
              })}
            >
              Ascending
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                startAtOrder: "desc",
              })}
            >
              Descending
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                startAtOrder: undefined,
              })}
              className="text-destructive-foreground bg-destructive"
            >
              Clear sort
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Order by End At */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {searchParams.endAtOrder
              ? `End at: ${searchParams.endAtOrder}`
              : "Sort end date"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                endAtOrder: "asc",
              })}
            >
              Ascending
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                endAtOrder: "desc",
              })}
            >
              Descending
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.tasks(), searchParams, {
                endAtOrder: undefined,
              })}
              className="text-destructive-foreground bg-destructive"
            >
              Clear sort
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
