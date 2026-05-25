import { TaskComment } from "@/types";
import api from "../axios";

export const getCommentsByTask = async (
  taskId: number,
): Promise<TaskComment[]> => {
  const response = await api.get(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (
  taskId: number,
  text: string,
): Promise<TaskComment> => {
  const response = await api.post(`/tasks/${taskId}/comments`, { text });
  return response.data;
};

export const deleteComment = async (
  taskId: number,
  commentId: number,
): Promise<void> => {
  await api.delete(`/tasks/${taskId}/comments/${commentId}`);
};
