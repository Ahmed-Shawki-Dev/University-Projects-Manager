import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export function getToken(request: NextRequest): string | undefined {
  return request.cookies.get("token")?.value;
}

export function getRouteSlugs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return {
    universitySlug: segments[1] || null,
    facultySlug: segments[2] || null,
  };
}

export function isProtectedRoute(pathname: string): boolean {
  const isInsideApp = pathname.startsWith("/app");

  return isInsideApp && !isAuthRoute(pathname);
}

export async function isTokenInvalidOrExpired(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return false;
  } catch {
    return true;
  }
}

export function isAuthRoute(pathname: string): boolean {
  return pathname.endsWith("/login") || pathname.endsWith("/register");
}
