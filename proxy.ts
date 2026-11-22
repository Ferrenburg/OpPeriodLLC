import { NextResponse, type NextRequest } from "next/server";

// Engine Bay Supply Co. is built under app/(engine-bay)/engine-bay but lives
// at the root of its own domain. On enginebaysupply.com this maps each page
// address onto the built page (/equipment is served from /engine-bay/equipment)
// and sends any /engine-bay/... address to the clean one. API routes, Next's
// own files, and anything with a file extension (photos, PDFs, icons) pass
// straight through. opperiod.com is untouched; its old /engine-bay links are
// redirected in next.config.ts.
const ENGINE_BAY_HOSTS = new Set(["enginebaysupply.com", "www.enginebaysupply.com"]);
const BASE = "/engine-bay";

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!ENGINE_BAY_HOSTS.has(host)) return NextResponse.next();

  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname === BASE || pathname.startsWith(`${BASE}/`)) {
    url.pathname = pathname.slice(BASE.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  url.pathname = pathname === "/" ? BASE : `${BASE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\.[a-zA-Z0-9]+$).*)", "/sitemap.xml", "/robots.txt"],
};
