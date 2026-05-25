"use client";

import * as React from "react";
import { User } from "@/types";
import { cn } from "@/lib/utils";

type TableProps = {
  users: User[];
  className?: string;
};

export function Table({ users, className }: TableProps) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-md border", className)}>
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="border-b">
            <th className="h-10 px-4 text-left font-medium">Name</th>
            <th className="h-10 px-4 text-left font-medium">Email</th>
            <th className="h-10 px-4 text-left font-medium">Role</th>
            <th className="h-10 px-4 text-left font-medium">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
              <td className="p-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
