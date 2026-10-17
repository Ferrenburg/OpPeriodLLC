"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavProject } from "@/lib/projects";

// Desktop "Projects" dropdown. A disclosure button, not a hover menu, so it
// works the same with a mouse, a keyboard, or a screen reader.
export function ProjectsMenu({ projects }: { projects: NavProject[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Close after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const inProjects = pathname === "/projects" || pathname.startsWith("/projects/");
  const items = [{ name: "All projects", href: "/projects" }, ...projects];

  return (
    <div
      ref={wrapper}
      className="relative"
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`nav-link inline-flex items-center gap-1 ${inProjects ? "nav-link-active" : ""}`}
      >
        Projects
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor">
          <path d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06z" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-20 mt-2 min-w-60 border border-line bg-bg py-2 shadow-lg"
      >
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 font-medium hover:bg-surface aria-[current=page]:text-accent"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
