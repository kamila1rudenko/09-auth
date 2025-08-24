// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession, type SessionResponse } from "./lib/api/serverApi";

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const AUTH_PAGES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.includes(pathname);

  const store = await cookies();
  const accessToken = store.get("accessToken")?.value;
  const refreshToken = store.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  const cookiesToSet: Array<{
    name: string;
    value: string;
    opts: { path?: string; expires?: Date; maxAge?: number };
  }> = [];

  if (!isAuthenticated && refreshToken) {
    try {
      const res = await checkServerSession();

      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        const lines = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const line of lines) {
          const parsed = parse(line);
          const opts = {
            path: parsed.Path,
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };
          if (parsed.accessToken)
            cookiesToSet.push({ name: "accessToken", value: parsed.accessToken, opts });
          if (parsed.refreshToken)
            cookiesToSet.push({ name: "refreshToken", value: parsed.refreshToken, opts });
        }
      }

      const data: SessionResponse = res.data;
      isAuthenticated =
        typeof data === "object" && data !== null ? ("success" in data ? data.success : true) : false;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivate && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("from", pathname);
    const resp = NextResponse.redirect(url);
    for (const c of cookiesToSet) resp.cookies.set(c.name, c.value, c.opts);
    return resp;
  }

  if (isAuthPage && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    const resp = NextResponse.redirect(url);
    for (const c of cookiesToSet) resp.cookies.set(c.name, c.value, c.opts);
    return resp;
  }

  const resp = NextResponse.next();
  for (const c of cookiesToSet) resp.cookies.set(c.name, c.value, c.opts);
  return resp;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
