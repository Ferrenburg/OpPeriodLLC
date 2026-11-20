"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavProject } from "@/lib/projects";
import { NavMenu } from "./nav-menu";

// Desktop "Projects" dropdown.
export function ProjectsMenu({ projects }: { projects: NavProject[] }) {
  const pathname = usePathname();
  const inProjects = pathname === "/projects" || pathname.startsWith("/projects/");
  const items = [{ name: "All projects", href: "/projects" }, ...projects];

  return (
    <NavMenu label="Projects" active={inProjects}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="block rounded-md px-3 py-2.5 font-semibold hover:bg-surface hover:text-accent aria-[current=page]:text-accent"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </NavMenu>
  );
}
