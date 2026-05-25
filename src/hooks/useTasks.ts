"use client";

import { getTasks } from "@/lib/api/tasks.api";
import { Task } from "@/types";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const useTasks = (projectId: string, search?: string) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = React.useState(true);
  const [pageError, setPageError] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchTasks = React.useCallback(async () => {
    if (!projectId) return;
    setTasksLoading(true);

    setPageError("");

    try {
      const priority = searchParams.get("priority");
      const assigneeId = searchParams.get("assigneeId");
      const rawSort = searchParams.get("sort");
      const sort =
        rawSort === "asc" || rawSort === "desc" ? rawSort : undefined;
      const response = await getTasks(Number(projectId), {
        priority: priority ?? undefined,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
        search: search ?? undefined,
        sort,
      });
      setTasks(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      console.error("Error fetching tasks:", error);
      setPageError("Could not load tasks. Please try again.");
    } finally {
      setTasksLoading(false);
    }
  }, [projectId, router, searchParams, search]);

  React.useEffect(() => {
    if (!projectId) return;

    const timeoutId = window.setTimeout(() => {
      void fetchTasks();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchTasks, projectId]);

  return { tasks, setTasks, tasksLoading, pageError, fetchTasks };
};
