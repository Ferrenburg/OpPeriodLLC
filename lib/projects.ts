import "server-only";

import { cache } from "react";
import { loadProjects, type Project } from "./project-loader";

export type { Project, ProjectStatus } from "./project-loader";

export type NavProject = { name: string; href: string };

// Everything published, retired included (their pages stay reachable).
export const getAllProjects = cache((): Project[] => loadProjects().filter((p) => p.published));

// What shows up in grids, menus, and the contact form: published and not retired.
export function getListedProjects(): Project[] {
  return getAllProjects().filter((p) => p.status !== "retired");
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getNavProjects(): NavProject[] {
  return getListedProjects().map(({ name, href }) => ({ name, href }));
}
