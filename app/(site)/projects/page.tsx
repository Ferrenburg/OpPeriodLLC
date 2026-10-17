import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { ProjectFilter } from "@/components/project-filter";
import { company } from "@/lib/brand";
import { getListedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: `The businesses and products under ${company.legalName}.`,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getListedProjects();
  return (
    <section className="container-site py-14 md:py-20">
      <span className="slant-bar" aria-hidden="true" />
      <h1 className="mt-3 font-display text-5xl font-bold uppercase italic md:text-6xl">Projects</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Everything under the {company.name} name, in one place.
      </p>
      <div className="mt-10">
        {projects.length === 0 && <p className="text-muted">Nothing to show yet. Check back soon.</p>}
        <ProjectFilter
          items={projects.map((project) => ({
            slug: project.slug,
            category: project.category,
            card: <ProjectCard project={project} headingLevel="h2" />,
          }))}
        />
      </div>
    </section>
  );
}
