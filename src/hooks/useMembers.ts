"use client";

import { getProjectsMembers } from "@/lib/api/members.api";
import { User } from "@/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export const useMembers = (projectId: number, enabled = true) => {
  const [members, setMembers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [errorStatus, setErrorStatus] = React.useState<number | null>(null);
  const router = useRouter();

  const fetchMembers = React.useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    setErrorStatus(null);
    try {
      const response = await getProjectsMembers(projectId);
      setMembers(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (error instanceof AxiosError) {
        setErrorStatus(error.response?.status ?? null);
      }

      console.error("Error fetching users:", error);
      setError("Could not load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, router, projectId]);

  React.useEffect(() => {
    if (!enabled) return;

    const timeoutId = window.setTimeout(() => {
      void fetchMembers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, fetchMembers]);

  return {
    members: enabled ? members : [],
    fetchMembers,
    isLoading: enabled ? isLoading : false,
    error: enabled ? error : null,
    errorStatus: enabled ? errorStatus : null,
  };
};
