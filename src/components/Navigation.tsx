"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "./ui";

export const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-10">
      <Link className="text-green-600 font-bold" href="/">
        Home
      </Link>

      {user ? (
        <>
          <Link className="text-green-600 font-bold" href="/dashboard">
            Dashboard
          </Link>
          <h3 className="text-gray-700 font-semibold">{user.name}</h3>

          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link className="text-green-600 font-bold" href="/login">
            Login
          </Link>

          <Link className="text-green-600 font-bold" href="/register">
            Register
          </Link>
        </>
      )}

      {user?.role === "ADMIN" && (
        <Link className="text-green-600 font-bold" href="/admin/users">
          Admin
        </Link>
      )}
    </div>
  );
};
