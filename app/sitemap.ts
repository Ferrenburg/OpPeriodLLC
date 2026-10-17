import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";
import { getListedProjects } from "@/lib/projects";

// Built from the content folder, so new projects show up automatically.
// Retired projects are left out (their pages are noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["/", "/projects", "/contact", "/privacy"];
  const projects = getListedProjects().map((project) => project.href);
  return [...pages, ...projects].map((path) => ({ url: new URL(path, base).toString() }));
}
