import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";

// Vercel already marks preview deployments noindex, so this only has to
// describe the live site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
