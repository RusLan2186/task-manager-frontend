import { Task } from "@/types";
import { Title } from "./Title";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

interface Props {
  tasks: Task[];
  status: "TODO" | "IN_PROGRESS" | "DONE";
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<Props> = ({
  tasks,
  status,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const statusText = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    DONE: "Done",
  }[status];

  const accentClass = {
    TODO: "bg-slate-100 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
    DONE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }[status];

  const columnClass = {
    TODO: "from-slate-50 to-slate-100/40",
    IN_PROGRESS: "from-amber-50 to-amber-100/40",
    DONE: "from-emerald-50 to-emerald-100/40",
  }[status];

  return (
    <section
      ref={setNodeRef}
      className={`rounded-2xl border bg-linear-to-b p-4 transition-all duration-200 ${columnClass} ${
        isOver
          ? "border-primary/50 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
          : "border-border/60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <Title className="text-foreground" text={statusText} size="sm" />
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${accentClass}`}
        >
          {tasks.length} tasks
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background/80 p-4 text-center">
          <p className="text-sm text-muted-foreground">No tasks yet</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Drag a task here to change status
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
