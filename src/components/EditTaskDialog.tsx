import { Task } from "@/types";
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

import React from "react";

import { TaskUpdate, taskUpdateSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types";
import { updateTask } from "@/lib/api/tasks.api";
import { FormField } from "./FormField";
import { PrioritySelect } from "./PrioritySelect";
import { AssigneeSelect } from "./AssigneeSelect";
import { toast } from "sonner";

interface Props {
  task: Task;
  projectId: string;
  onTaskUpdated: () => void;
  users: User[];
}

export const EditTaskDialog: React.FC<Props> = ({
  task,
  projectId,
  onTaskUpdated,
  users,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskUpdate>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority as TaskUpdate["priority"],
      assigneeId: task.assigneeId ?? null,
    },
  });

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: TaskUpdate) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateTask(projectId, task.id, data);
      onTaskUpdated();
      setOpen(false);
      toast.success("Task updated");
    } catch {
      const message = "Failed to update task";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Fill out the form below to edit the task.
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
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
