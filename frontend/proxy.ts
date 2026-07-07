import { NextResponse, type NextRequest } from "next/server";
import {
  getRouteSlugs,
  getToken,
  isAuthRoute,
  isProtectedRoute,
  isTokenInvalidOrExpired,
} from "./lib/auth-helpers";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getToken(request);
  const { universitySlug, facultySlug } = getRouteSlugs(pathname);

  const isTokenInvalid = token ? await isTokenInvalidOrExpired(token) : true;

  if (pathname.startsWith("/app") && (!universitySlug || !facultySlug)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute(pathname) && token && !isTokenInvalid) {
    return NextResponse.redirect(
      new URL(`/app/${universitySlug}/${facultySlug}`, request.url),
    );
  }

  if (isProtectedRoute(pathname)) {
    if (!token || isTokenInvalid) {
      const response = NextResponse.redirect(
        new URL(`/app/${universitySlug}/${facultySlug}/login`, request.url),
      );
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
