"use client";

import { useForm } from "react-hook-form";
import { Button, Input } from "./ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { taskCreateSchema } from "@/lib/validators";
import type { TaskCreate } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { mapApiError } from "@/lib/axios";
import React from "react";
import { User } from "@/types";
import { createTask } from "@/lib/api/tasks.api";
import { FormField } from "./FormField";
import { PrioritySelect } from "./PrioritySelect";
import { AssigneeSelect } from "./AssigneeSelect";
import { toast } from "sonner";

interface Props {
  projectId: string;
  onTaskCreated: () => void;
  users: User[];
  triggerClassName?: string;
}

export const CreateTaskDialog: React.FC<Props> = ({
  projectId,
  onTaskCreated,
  users,
  triggerClassName,
}) => {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskCreate>({
    resolver: zodResolver(taskCreateSchema),
    mode: "onChange",
    defaultValues: {
      priority: undefined as unknown as TaskCreate["priority"],
    },
  });

  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: TaskCreate) => {
    setError("");
    setIsLoading(true);
    try {
      await createTask(projectId, data);
      reset({
        title: "",
        description: "",
        priority: undefined as unknown as TaskCreate["priority"],
      });
      setOpen(false);
      onTaskCreated();
      toast.success("Task created");
    } catch (err: unknown) {
      const parsedError = mapApiError(err, {
        badRequest: "Please check the task data.",
        unauthorized: "You are not authorized to create tasks.",
        tooManyRequests: "Too many attempts. Try again later.",
      });

      if (parsedError.shouldLog) {
        console.error("Task creation failed:", err);
      }

      setError(parsedError.message);
      toast.error(parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className={triggerClassName}>
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormField label="Title" error={errors.title?.message}>
              <Input
                id="title"
                placeholder="Task title"
                {...register("title")}
              />
            </FormField>

            <FormField label="Description" error={errors.description?.message}>
              <Input
                id="description"
                placeholder="Task description"
                {...register("description")}
              />
            </FormField>

            <PrioritySelect
              control={control}
              label="Priority"
              error={errors.priority?.message ?? ""}
            />

            <AssigneeSelect
              control={control}
              label="Assignee"
              error={errors.assigneeId?.message ?? ""}
              users={users}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
