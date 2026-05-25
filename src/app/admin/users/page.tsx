"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Title } from "@/components/Title";
import { Input, Table } from "@/components/ui";

import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUsers";

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const canViewUsers = user?.role === "ADMIN";
  const { users, isLoading, errorStatus } = useUsers(search, canViewUsers);

  React.useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [authLoading, router, user]);

  React.useEffect(() => {
    if (errorStatus === 403) {
      router.push("/dashboard");
    }
  }, [errorStatus, router]);

  if (authLoading || !user || !canViewUsers) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div>
      <Title className="mb-5" text="Users" size="xl" />

      <div className="mb-5 w-1/3">
        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading users...</p>
      ) : users.length > 0 ? (
        <Table users={users} />
      ) : (
        <h1>No users found</h1>
      )}
    </div>
  );
}
