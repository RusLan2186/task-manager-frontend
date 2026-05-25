import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.next();
    }

    try {
      const decoded = jwtDecode<{ role: string }>(token);

      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard", request.nextUrl.origin),
        );
      }
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
