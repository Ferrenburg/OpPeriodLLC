import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";
import { ebPages } from "@/lib/engine-bay";
import { brandPath, getBrands, getProducts } from "@/lib/engine-bay-catalog";
import { getListedProjects } from "@/lib/projects";

// Built from the content folder, so new projects show up automatically.
// Retired projects are left out (their pages are noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["/", "/projects", "/contact", "/privacy"];
  const projects = getListedProjects().map((project) => project.href);
  const catalog = [...getBrands().map(brandPath), ...getProducts().map((product) => product.href)];
  const unique = new Set([...pages, ...projects, ...ebPages, ...catalog]);
  return [...unique].map((path) => ({ url: new URL(path, base).toString() }));
}
