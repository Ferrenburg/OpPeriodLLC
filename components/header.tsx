import Link from "next/link";
import { logos, mainNav } from "@/lib/brand";
import type { NavProject } from "@/lib/projects";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ProjectsMenu } from "./projects-menu";
import { ThemeToggle } from "./theme-toggle";

export function Header({ projects }: { projects: NavProject[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="container-site relative flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="shrink-0">
          <Logo logo={logos.opperiod} className="h-7 md:h-9" priority />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
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

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu projects={projects} />
        </div>
      </div>
    </header>
  );
}
