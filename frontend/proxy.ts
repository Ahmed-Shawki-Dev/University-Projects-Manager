import { decodeJwt } from "jose";
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

  if (isAuthRoute(pathname)) {
    if (token && !isTokenInvalid) {
      const payload = decodeJwt(token);
      return NextResponse.redirect(
        new URL(
          `/app/${payload.UniversitySlug}/${payload.FacultySlug}/projects`,
          request.url,
        ),
      );
    }
    return NextResponse.next();
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

  const payload = decodeJwt(token!);
  const tokenUni = String(payload.universitySlug).toLowerCase();
  const tokenFac = String(payload.facultySlug).toLowerCase();

  if (
    tokenUni !== universitySlug?.toLowerCase() ||
    tokenFac !== facultySlug?.toLowerCase()
  ) {
    return NextResponse.redirect(
      new URL(
        `/app/${payload.universitySlug}/${payload.facultySlug}/projects`,
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
