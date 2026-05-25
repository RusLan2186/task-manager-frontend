"use client";

import { CommentCreate, commentCreateSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "./ui";

import { mapApiError } from "@/lib/axios";
import React from "react";
import { createComment } from "@/lib/api/comments.api";
import { toast } from "sonner";
import { TaskComment } from "@/types";

interface Props {
  taskId: number;
  onCommentCreated: () => void;
  currentUserId: number;
  setComments: React.Dispatch<React.SetStateAction<TaskComment[]>>;
}

export const CreateCommentsDialog: React.FC<Props> = ({
  taskId,
  onCommentCreated,
  currentUserId,
  setComments,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentCreate>({
    resolver: zodResolver(commentCreateSchema),
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [nextOptimisticId, setNextOptimisticId] = React.useState(-1);

  const onSubmit = async (data: CommentCreate) => {
    setIsLoading(true);
    const optimisticId = nextOptimisticId;
    setNextOptimisticId((prev) => prev - 1);

    const optimisticComment: TaskComment = {
      id: optimisticId,
      text: data.text,
      taskId,
      authorId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [optimisticComment, ...prev]);

    try {
      const createdComment = await createComment(taskId, data.text);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === optimisticComment.id ? createdComment : comment,
        ),
      );
      reset({
        text: "",
      });

      onCommentCreated();
      toast.success("Comment added");
    } catch (err: unknown) {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticComment.id),
      );
      const parsedError = mapApiError(err, {
        badRequest: "Please check the comment data.",
        unauthorized: "You are not authorized to create comments.",
        tooManyRequests: "Too many attempts. Try again later.",
      });

      if (parsedError.shouldLog) {
        console.error("Comment creation failed:", err);
      }
      toast.error(parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-7">
      <div className="space-y-2">
        <Input id="title" placeholder="Comment text" {...register("text")} />
        {errors.text?.message && (
          <p className="text-sm text-red-500">{errors.text.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
};
