import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Retires the participant registration route.
 *
 * This lives in middleware rather than `redirects()` in next.config.ts because
 * a config redirect forwards the request's query string to the destination.
 * Stale links are of the form `/signup?role=gestational_surrogate`, and
 * forwarding that would put a retired participant role back into the URL of
 * the clinic flow — visible in the address bar and, via the Referer header, in
 * the stored lead. The query is dropped here instead.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/clinic-interest";
  url.search = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/signup",
};
