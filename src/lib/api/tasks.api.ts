import { Task } from "@/types";
import api from "../axios";
import { TaskCreate, TaskUpdate } from "../validators";

export const getTasks = async (
  projectId: number,
  filters?: {
    priority?: string;
    assigneeId?: number;
    search?: string;
    sort?: "asc" | "desc";
  },
): Promise<Task[]> => {
  const response = await api.get(`/projects/${projectId}/tasks`, {
    params: filters,
  });
  return response.data;
};

export const createTask = async (
  projectId: string,
  task: TaskCreate,
): Promise<Task> => {
  const response = await api.post(`/projects/${projectId}/tasks`, task);
  return response.data;
};

export const updateTask = async (
  projectId: string,
  taskId: number,
  task: TaskUpdate,
): Promise<Task> => {
  const response = await api.put(
    `/projects/${projectId}/tasks/${taskId}`,
    task,
  );
  return response.data;
};

export const deleteTask = async (
  projectId: number,
  taskId: number,
): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
};
