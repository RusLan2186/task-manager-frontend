"use client";

import { getMe, logout as logoutApi } from "@/lib/api/auth.api";
import { User } from "@/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { createContext, useContext } from "react";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await getMe();

        setUser(response);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          setUser(null);
        } else {
          toast.error("Failed to load user profile");
          console.error("Failed to fetch current user:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refetchUser = async () => {
    try {
      const response = await getMe();
      setUser(response);
    } catch (err) {
      toast.error("Failed to refresh user profile");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Failed to log out");
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
