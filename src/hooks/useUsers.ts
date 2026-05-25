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
  const [errorStatus, setErrorStatus] = React.useState<number | null>(null);
  const router = useRouter();

  const fetchUsers = React.useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    setErrorStatus(null);
    try {
      const response = await getUsers(search);
      setUsers(response);
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
  }, [enabled, router, search]);

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
    errorStatus: enabled ? errorStatus : null,
  };
};
