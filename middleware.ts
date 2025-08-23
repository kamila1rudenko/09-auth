// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const AUTH_PAGES = ["/sign-in", "/sign-up"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  const hasAccess =
    Boolean(req.cookies.get("accessToken")) ||
    Boolean(req.cookies.get("refreshToken"));

  if (isPrivate && !hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
   url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasAccess) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
