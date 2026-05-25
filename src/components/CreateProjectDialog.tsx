"use client";

import { ProjectCreate, projectCreateSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Dialog, Input } from "./ui";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import React from "react";
import { mapApiError } from "@/lib/axios";
import { createProject } from "@/lib/api/projects.api";
import { FormField } from "./FormField";
import { toast } from "sonner";

interface Props {
  onProjectCreated: () => void;
}

export const CreateProjectDialog: React.FC<Props> = ({ onProjectCreated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectCreate>({
    resolver: zodResolver(projectCreateSchema),
    mode: "onChange",
  });

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: ProjectCreate) => {
    setError("");

    try {
      await createProject(data);
      reset({
        title: "",
        description: "",
      });
      setOpen(false);
      onProjectCreated();
      toast.success("Project created");
    } catch (err: unknown) {
      const parsedError = mapApiError(err, {
        badRequest: "Please check the project data.",
        unauthorized: "You are not authorized to create projects.",
        tooManyRequests: "Too many attempts. Try again later.",
      });

      if (parsedError.shouldLog) {
        console.error("Project creation failed:", err);
      }

      setError(parsedError.message);
      toast.error(parsedError.message);
    } finally {
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Project</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormField label="Title" error={errors.title?.message}>
              <Input
                id="title"
                placeholder="Project title"
                {...register("title")}
              />
            </FormField>

            <FormField label="Description" error={errors.description?.message}>
              <Input
                id="description"
                placeholder="Project description"
                {...register("description")}
              />
            </FormField>
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
