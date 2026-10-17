import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { FeatureGrid } from "@/components/mdx";
import { ProjectCard } from "@/components/project-card";
import { ProjectMark } from "@/components/project-mark";
import { StatusBadge } from "@/components/status-badge";
import { company } from "@/lib/brand";
import { MdxBody } from "@/lib/mdx";
import { getAllProjects, getListedProjects, getProject } from "@/lib/projects";

// Only the pages generated from content exist. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: project.href },
    // Retired pages stay up for old links but drop out of search.
    robots: project.status === "retired" ? { index: false } : undefined,
    openGraph: { title: `${project.name} | ${company.legalName}`, description: project.summary, url: project.href },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const retired = project.status === "retired";
  const comingSoon = project.status === "coming-soon";
  const cta =
    project.cta ??
    (comingSoon ? { label: "Get notified", href: `/contact?project=${project.slug}` } : undefined);
  const others = getListedProjects()
    .filter((other) => other.slug !== project.slug)
    .slice(0, 2);

  // Building blocks on this page pick up the project's color from these.
  const accentVars = {
    "--project-accent": project.accent,
    "--project-accent-text": project.accentText,
    "--slant-color": project.accent,
  } as React.CSSProperties;

  return (
    <div style={accentVars}>
      {retired && (
        <p className="bg-surface py-3 text-center text-sm font-semibold">
          {project.name} is no longer active. This page is kept for reference.
        </p>
      )}

      <section className="border-b border-line">
        <div className="h-1.5" style={{ background: project.accent }} />
        <div className="container-site grid items-center gap-8 py-12 md:grid-cols-[auto_1fr] md:gap-12 md:py-16">
          <ProjectMark
            project={project}
            className="h-24 text-6xl md:h-40 md:text-8xl"
            sizes="(min-width: 768px) 240px, 150px"
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">{project.category}</p>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase italic leading-none md:text-6xl">
              {project.name}
            </h1>
            <p className="mt-3 text-xl text-muted">{project.tagline}</p>
            {project.serviceArea && (
              <p className="mt-2">
                <span className="font-semibold">Service area:</span> {project.serviceArea}
              </p>
            )}
            {!retired && (cta || project.externalUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {cta && (
                  <ButtonLink href={cta.href} variant="accent">
                    {cta.label}
                  </ButtonLink>
                )}
                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    className="inline-flex min-h-12 items-center rounded-sm border-2 border-fg px-6 font-display text-lg font-semibold uppercase italic tracking-wide hover:bg-fg hover:text-bg"
                  >
                    Visit site
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-site py-12 md:py-16">
        {comingSoon ? (
          <p className="max-w-2xl text-lg leading-relaxed">{project.summary}</p>
        ) : (
          <MdxBody source={project.body} file={project.file} />
        )}
      </div>

      {!comingSoon && project.highlights && (
        <section className="bg-surface py-12 md:py-16">
          <div className="container-site">
            <h2 className="font-display text-3xl font-bold uppercase italic md:text-4xl">At a glance</h2>
            <FeatureGrid items={project.highlights} />
          </div>
        </section>
      )}

      <section className="container-site py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase italic md:text-4xl">
              Part of the {company.name} family
            </h2>
            <p className="mt-2 text-muted">
              {project.name} is one of the projects under {company.legalName}.
            </p>
          </div>
          <Link href="/projects" className="font-semibold text-accent underline underline-offset-4">
            See all projects
          </Link>
        </div>
        {others.length > 0 && (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {others.map((other) => (
              <li key={other.slug}>
                <ProjectCard project={other} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
