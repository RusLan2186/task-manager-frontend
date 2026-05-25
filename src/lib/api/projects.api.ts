import { Project } from "@/types";
import api from "../axios";

export const getProjects = async (
  search?: string,
  sort?: "asc" | "desc",
): Promise<Project[]> => {
  const response = await api.get("/projects", {
    params: { search, sort },
  });
  return response.data;
};

export const getProjectById = async (projectId: number): Promise<Project> => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (projectData: {
  title: string;
  description: string;
}): Promise<Project> => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const deleteProject = async (projectId: number): Promise<void> => {
  await api.delete(`/projects/${projectId}`);
};
