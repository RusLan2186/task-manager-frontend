import { Task, User } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import React from "react";
import { TaskDrawer } from "./TaskDrawer";
import { updateTask } from "@/lib/api/tasks.api";
import { TaskUpdate } from "@/lib/validators";
import { toast } from "sonner";

interface Props {
  tasks: Task[];
  projectId: string;
  onTaskStatusChange: (tasks: Task[]) => void;
  onTaskUpdated: () => void;
  ownerId?: number;
  users: User[];
}

export const KanbanBoard: React.FC<Props> = ({
  tasks,
  projectId,
  onTaskStatusChange,
  onTaskUpdated,
  ownerId,
  users,
}) => {
  const [activeTaskId, setActiveTaskId] =
    React.useState<UniqueIdentifier | null>(null);
  const [activeTaskWidth, setActiveTaskWidth] = React.useState<number | null>(
    null,
  );
  const clearTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const todoTasks = React.useMemo(
    () => tasks.filter((task) => task.status === "TODO"),
    [tasks],
  );
  const inProgressTasks = React.useMemo(
    () => tasks.filter((task) => task.status === "IN_PROGRESS"),
    [tasks],
  );
  const doneTasks = React.useMemo(
    () => tasks.filter((task) => task.status === "DONE"),
    [tasks],
  );

  const activeTask = tasks.find((task) => task.id === Number(activeTaskId));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const clearActiveDragState = React.useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }

    setActiveTaskId(null);
    setActiveTaskWidth(null);
  }, []);

  React.useEffect(() => {
    return () => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveTaskId(event.active.id);
    setActiveTaskWidth(event.active.rect.current.initial?.width ?? null);
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      clearActiveDragState();
      return;
    }

    const validStatuses: Task["status"][] = ["TODO", "IN_PROGRESS", "DONE"];

    const newStatusCandidate = String(over.id);
    if (!validStatuses.includes(newStatusCandidate as Task["status"])) {
      clearActiveDragState();
      return;
    }

    const taskId = Number(active.id);
    const newStatus = newStatusCandidate as Task["status"];

    const currentTask = tasks.find((task) => task.id === taskId);
    if (!currentTask || currentTask.status === newStatus) {
      clearActiveDragState();
      return;
    }

    const previousTasks = tasks;
    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task,
    );

    onTaskStatusChange(nextTasks);
    clearTimerRef.current = setTimeout(() => {
      clearActiveDragState();
    }, 110);

    try {
      await updateTask(projectId, taskId, {
        status: newStatus as TaskUpdate["status"],
      });
      const statusLabel =
        newStatus === "TODO"
          ? "To do"
          : newStatus === "IN_PROGRESS"
            ? "In progress"
            : "Done";
      toast.success(`Task moved to ${statusLabel}`);
    } catch (error) {
      onTaskStatusChange(previousTasks);
      toast.error("Failed to update task status");
      console.error("Failed to update task status:", error);
    }
  };

  const handleDragCancel = React.useCallback(() => {
    clearActiveDragState();
  }, [clearActiveDragState]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Drag tasks between columns to update status
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
              To do: {todoTasks.length}
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700">
              In progress: {inProgressTasks.length}
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
              Done: {doneTasks.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <KanbanColumn
            tasks={todoTasks}
            status="TODO"
            onTaskClick={handleTaskClick}
          />

          <KanbanColumn
            tasks={inProgressTasks}
            status="IN_PROGRESS"
            onTaskClick={handleTaskClick}
          />

          <KanbanColumn
            tasks={doneTasks}
            status="DONE"
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div
            className="scale-[1.01]"
            style={activeTaskWidth ? { width: activeTaskWidth } : undefined}
          >
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          open={drawerOpen}
          projectId={projectId}
          onClose={setDrawerOpen}
          onTaskUpdated={onTaskUpdated}
          ownerId={ownerId}
          users={users}
        />
      )}
    </DndContext>
  );
};
