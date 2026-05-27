"use client";

import { Task } from "@/types";
import { User } from "@/types";
import React from "react";
import { Card } from "./ui";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useDraggable } from "@dnd-kit/core";

interface Props {
  task: Task;
  participants?: User[];
  isOverlay?: boolean;
  onClick?: () => void;
}

export const TaskCard: React.FC<Props> = ({
  task,
  participants = [],
  isOverlay = false,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  });

  const dragClassName = isOverlay
    ? "cursor-grabbing border-primary/45 bg-card/95 shadow-2xl ring-1 ring-primary/25"
    : isDragging
      ? "cursor-grabbing opacity-25"
      : "cursor-grab hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing";

  const priorityClass = {
    HIGH: "bg-rose-100 text-rose-700 border-rose-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    LOW: "bg-sky-100 text-sky-700 border-sky-200",
  }[task.priority];

  const statusLabel = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    DONE: "Done",
  }[task.status];

  return (
    <>
      <Card
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`border border-border/60 bg-background/90 py-3 shadow-sm transition-all duration-200 will-change-transform ${dragClassName}`}
        onClick={onClick}
      >
        <CardHeader className="px-3 pb-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityClass}`}
            >
              {task.priority}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {statusLabel}
            </span>
          </div>
          <CardTitle className="text-sm leading-snug tracking-tight">
            {task.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-0">
          <CardDescription className="line-clamp-3 text-xs">
            {task.description || "No description"}
          </CardDescription>

          {participants.length > 0 && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                Participants
              </p>
              <div className="flex -space-x-1.5">
                {participants.slice(0, 4).map((user) => (
                  <span
                    key={user.id}
                    title={user.name}
                    className="inline-flex size-6 items-center justify-center rounded-full border border-background bg-muted text-[10px] font-semibold text-foreground"
                  >
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                ))}
                {participants.length > 4 && (
                  <span className="inline-flex size-6 items-center justify-center rounded-full border border-background bg-muted text-[10px] font-semibold text-muted-foreground">
                    +{participants.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {task.assignee && (
            <p className="mt-3 inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              Assigned to: {task.assignee.name}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
