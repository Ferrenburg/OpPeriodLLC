import Link from "next/link";
import { company, logos, mainNav } from "@/lib/brand";
import type { NavProject } from "@/lib/projects";
import { buttonClass } from "./button";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ProjectsMenu } from "./projects-menu";

// Light utility bar with the projects and the email address, then a
// translucent sticky bar with the logo, menu, and the contact button.
export function Header({ projects }: { projects: NavProject[] }) {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line bg-surface/95">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
          <nav aria-label="Projects" className="hidden md:block">
            <ul className="-ml-3 flex gap-1">
              {projects.map((project) => (
                <li key={project.href}>
                  <Link href={project.href} className="rounded-md px-3 py-1.5 text-muted hover:bg-fg/[0.04] hover:text-accent">
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a href={`mailto:${company.email}`} className="ml-auto normal-case tracking-normal text-fg hover:text-accent">
            {company.email}
          </a>
        </div>
      </div>

      <div className="border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-site relative flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Logo logo={logos.opperiod} className="h-7 md:h-9" sizes="160px" priority />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {mainNav.map((item) => (
                <li key={item.href}>
                  {item.href === "/projects" ? (
                    <ProjectsMenu projects={projects} />
                  ) : (
                    <NavLink href={item.href}>{item.label}</NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/contact" className={buttonClass("primary", "min-h-11 px-5 max-sm:hidden")}>
              Get in touch
            </Link>
            <MobileMenu projects={projects} />
          </div>
        </div>
      </div>
    </header>
  );
}
