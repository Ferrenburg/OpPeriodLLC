"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav } from "@/lib/brand";
import type { NavProject } from "@/lib/projects";

export function MobileMenu({ projects }: { projects: NavProject[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const link = (href: string, label: string, nested = false) => (
    <Link
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      onClick={() => setOpen(false)}
      className={`block py-3 font-display text-xl font-semibold uppercase italic tracking-wide aria-[current=page]:text-accent ${nested ? "pl-4 text-lg normal-case not-italic text-muted aria-[current=page]:text-accent" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="md:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-surface"
      >
        <span className="sr-only">Menu</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-bg shadow-lg"
      >
        <ul className="container-site divide-y divide-line py-2">
          {mainNav.map((item) => (
            <li key={item.href}>
              {link(item.href, item.label)}
              {item.href === "/projects" && projects.length > 0 && (
                <ul className="pb-2">
                  {projects.map((project) => (
                    <li key={project.href}>{link(project.href, project.name, true)}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
