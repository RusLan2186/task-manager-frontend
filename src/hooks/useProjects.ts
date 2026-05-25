"use client";

import { createProject, getProjects } from "@/lib/api/projects.api";

import { ProjectCreate } from "@/lib/validators";
import { Project } from "@/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export const useProjects = (search?: string, sort?: "asc" | "desc") => {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProjects(search, sort);
      setProjects(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      console.error("Error fetching projects:", error);
      setError("Could not load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router, search, sort]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProjects();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchProjects]);

  const addProject = async (data: ProjectCreate) => {
    await createProject(data);
    await fetchProjects();
  };

  return {
    projects,
    setProjects,
    isLoading,
    error,
    setError,
    refetch: fetchProjects,
    addProject,
  };
};
