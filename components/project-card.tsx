import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectMark } from "./project-mark";
import { StatusBadge } from "./status-badge";

// The accent color only shows as the top border, so project brands don't
// fight the parent site or each other.
export function ProjectCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link
      href={project.href}
      className="card card-hover group relative flex h-full flex-col overflow-hidden p-6"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ background: project.accent }} />
      <div className="flex h-20 items-center">
        <ProjectMark project={project} className="h-16 text-4xl" sizes="120px" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Heading className="font-display text-2xl font-bold uppercase group-hover:text-accent">
          {project.name}
        </Heading>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-2 text-muted">{project.tagline}</p>
    </Link>
  );
}
