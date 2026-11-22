import { engineBayLink, siteUrl } from "@/lib/brand";

// enginebaysupply.com/robots.txt (proxy.ts maps it here). opperiod.com has
// its own in app/robots.ts.
export function GET() {
  const sitemap = new URL(engineBayLink("/sitemap.xml"), siteUrl());
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
