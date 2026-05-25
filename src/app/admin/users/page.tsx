"use client";

import React from "react";
import { Title } from "@/components/Title";
import { Input, Table } from "@/components/ui";

import { useUsers } from "@/hooks/useUsers";

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("");
  const { users } = useUsers(search);

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

      {users.length > 0 ? <Table users={users} /> : <h1>No users found</h1>}
    </div>
  );
}
