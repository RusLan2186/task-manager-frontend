"use client";
import React from "react";
import { debounce } from "lodash";
import {
  CreateTaskDialog,
  KanbanBoard,
  TaskFilters,
  Title,
} from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/hooks/useProject";
import { useTasks } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string | string[] }>();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = useAuth();
  const { users } = useUsers();
  const search = searchParams.get("search") ?? "";
  const priorityValue = searchParams.get("priority") ?? "ALL";
  const assigneeIdValue = searchParams.get("assigneeId") ?? "ALL";
  const rawSort = searchParams.get("sort");
  const sortValue = rawSort === "asc" || rawSort === "desc" ? rawSort : "ALL";
  const { tasks, setTasks, tasksLoading, pageError, fetchTasks } = useTasks(
    projectId ?? "",
    search,
  );

  const [searchValue, setSearchValue] = React.useState(search);
  const { project } = useProject(projectId ?? "");
  const availableUsers = React.useMemo(() => {
    if (!user) return users;

    const hasCurrentUser = users.some((item) => item.id === user.id);
    return hasCurrentUser ? users : [user, ...users];
  }, [user, users]);

  const handleSearch = React.useRef(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/dashboard/projects/${projectId}?${params.toString()}`);
    }, 300),
  ).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };

  if (!projectId) {
    return <p className="text-muted-foreground mt-2">Project not found</p>;
  }

  const hasActiveFilters = Boolean(
    searchParams.get("priority") ||
    searchParams.get("assigneeId") ||
    searchParams.get("sort"),
  );
  const hasSearchQuery = Boolean(searchParams.get("search"));
  const showSearchInput = tasks.length > 0 || hasSearchQuery;

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();
    router.push(
      queryString
        ? `/dashboard/projects/${projectId}?${queryString}`
        : `/dashboard/projects/${projectId}`,
    );
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Title
            text={`Project ${projectId}`}
            size="lg"
            className="text-balance"
          />
          <CreateTaskDialog
            projectId={projectId}
            onTaskCreated={fetchTasks}
            users={availableUsers}
          />
        </div>
      </section>

      <div
        className={`rounded-2xl border border-border/60 bg-background/70 p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center ${
          showSearchInput ? "lg:justify-between" : "lg:justify-end"
        }`}
      >
        {showSearchInput && (
          <Input
            className="w-full lg:max-w-md"
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleChange}
          />
        )}

        {(tasks.length > 0 || hasActiveFilters) && (
          <TaskFilters
            users={availableUsers}
            handleFilterChange={handleFilterChange}
            priorityValue={priorityValue}
            assigneeIdValue={assigneeIdValue}
            sortValue={sortValue}
          />
        )}
      </div>

      {tasksLoading ? (
        <p className="rounded-xl border border-border/60 bg-card/70 px-4 py-6 text-muted-foreground">
          Loading tasks...
        </p>
      ) : pageError ? (
        <p className="rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </p>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 py-16 px-4 shadow-sm">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold text-foreground">
              {hasActiveFilters
                ? "No tasks match current filters"
                : "No tasks yet"}
            </p>
            <p className="mb-6 text-muted-foreground">
              {hasActiveFilters
                ? "Try changing or resetting filters"
                : "Create your first task to get started"}
            </p>
            {!hasActiveFilters && (
              <CreateTaskDialog
                projectId={projectId}
                onTaskCreated={fetchTasks}
                users={availableUsers}
              />
            )}
          </div>
        </div>
      ) : (
        <div>
          <KanbanBoard
            tasks={tasks}
            onTaskStatusChange={setTasks}
            projectId={projectId}
            onTaskUpdated={fetchTasks}
            ownerId={project?.ownerId}
            users={availableUsers}
          />
        </div>
      )}
    </div>
  );
}
