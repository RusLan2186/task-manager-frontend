"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui";

type NavigationProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
};

export const Navigation = ({
  isMobile = false,
  onNavigate,
}: NavigationProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  const layoutClassName = isMobile
    ? "flex flex-col items-start gap-5"
    : "flex items-center flex-wrap gap-x-10";

  const baseLinkClassName = isMobile
    ? "font-bold text-lg leading-none transition-colors"
    : "font-bold transition-colors";

  const getLinkClassName = (href: string) => {
    const isDashboard = href === "/dashboard";
    const isActive = isDashboard
      ? pathname.startsWith("/dashboard")
      : pathname.startsWith(href);

    return `${baseLinkClassName} ${
      isActive ? "text-green-600" : "text-foreground hover:text-green-600"
    }`;
  };
  const userClassName = isMobile
    ? "text-gray-700 font-semibold text-lg"
    : "text-gray-700 font-semibold";
  const logoutButtonSize = isMobile ? "default" : "sm";

  return (
    <div className={layoutClassName}>
      {user ? (
        <>
          <Link
            className={getLinkClassName("/dashboard")}
            href="/dashboard"
            onClick={onNavigate}
          >
            Dashboard
          </Link>
          {user.role === "ADMIN" && (
            <Link
              className={getLinkClassName("/admin")}
              href="/admin/users"
              onClick={onNavigate}
            >
              Admin
            </Link>
          )}
          <h3 className={userClassName}>{user.name}</h3>

          <Button
            onClick={handleLogout}
            variant="outline"
            size={logoutButtonSize}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link
            className={getLinkClassName("/login")}
            href="/login"
            onClick={onNavigate}
          >
            Login
          </Link>

          <Link
            className={getLinkClassName("/register")}
            href="/register"
            onClick={onNavigate}
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};
