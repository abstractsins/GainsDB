import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token"); // Adjust based on your auth method

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

  // Check if user is not logged in and is trying to access a protected route
  if (!token && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Specify the matcher for which routes should trigger the middleware
export const config = {
  matcher: ["/dashboard/:path*"], // Protects /dashboard and all subroutes
};
