"use client";
import { getUsers } from "@/lib/api/users.api";
import { User } from "@/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export const useUsers = (search?: string, enabled = true) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();


  const fetchUsers = React.useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers(search);
      setUsers(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (error instanceof AxiosError && error.response?.status === 403) {
        router.push("/dashboard");
        return;
      }

      console.error("Error fetching users:", error);
      setError("Could not load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, router, search]);

  React.useEffect(() => {
    if (!enabled) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, fetchUsers]);

  return { users, isLoading, error };
};
