"use client";

import {  getCommentsByTask } from "@/lib/api/comments.api";
import { Task, TaskComment } from "@/types";
import React from "react";

export const useComments = (open: boolean, task: Task) => {
  const [comments, setComments] = React.useState<TaskComment[]>([]);

  const fetchComments = React.useCallback(async () => {
    try {
      const response = await getCommentsByTask(task.id);
      setComments(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [task.id]);



  React.useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      void fetchComments();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open, fetchComments]);


  return { comments, setComments, fetchComments };
};
