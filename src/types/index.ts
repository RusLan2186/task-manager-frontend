export type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  createdAt: string;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  ownerId?: number;
  canAccessTasks?: boolean;
  owner: { name: string } | null;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId: number;
  projectId: number;
  createdAt: string;
  assignee: { name: string } | null;
};

export type TaskComment = {
  id: number;
  text: string;
  taskId: number;
  authorId: number;
  createdAt: string;
};
