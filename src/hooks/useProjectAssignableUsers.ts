"use client";

import React from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { getProjectMemberCandidates } from "@/lib/api/members.api";

export const useProjectAssignableUsers = (
  projectId: number,
  enabled = true,
) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = React.useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProjectMemberCandidates(projectId);
      setUsers(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (error instanceof AxiosError && error.response?.status === 403) {
        setError("Only the project owner can add members.");
        return;
      }

      console.error("Error fetching assignable users:", error);
      setError("Could not load available users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, projectId, router]);

  React.useEffect(() => {
    if (!enabled) return;

    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, fetchUsers]);

  return {
    users: enabled ? users : [],
    isLoading: enabled ? isLoading : false,
    error: enabled ? error : null,
    refetchUsers: fetchUsers,
  };
};
