import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";
import { getListedProjects } from "@/lib/projects";

// Built from the content folder, so new projects show up automatically.
// Retired projects are left out (their pages are noindex). Engine Bay has its
// own sitemap on enginebaysupply.com (app/(engine-bay)/engine-bay/sitemap.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["/", "/projects", "/contact", "/privacy"];
  const projects = getListedProjects()
    .filter((project) => !project.siteUrl && !project.sitePath)
    .map((project) => project.href);
  const unique = new Set([...pages, ...projects]);
  return [...unique].map((path) => ({ url: new URL(path, base).toString() }));
}
