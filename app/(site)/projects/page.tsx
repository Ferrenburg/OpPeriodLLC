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
      <p className="eyebrow">{company.legalName}</p>
      <h1 className="mt-4 font-display text-[clamp(2.9rem,6vw,4.8rem)] font-bold uppercase leading-[0.92]">Projects</h1>
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
