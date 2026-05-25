"use client";

import { getProjectById } from "@/lib/api/projects.api";
import { Project } from "@/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export const useProject = (projectId: string) => {
  const [project, setProject] = React.useState<Project | null>(null);
  const router = useRouter();

  const fetchOneProject = React.useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await getProjectById(Number(projectId));
      setProject(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      console.error("Error fetching project:", error);
    }
  }, [router, projectId]);

  React.useEffect(() => {
    if (!projectId) return;

    const timeoutId = window.setTimeout(() => {
      void fetchOneProject();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchOneProject, projectId]);

  return { project, fetchOneProject };
};
