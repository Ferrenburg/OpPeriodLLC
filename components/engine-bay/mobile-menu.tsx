"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ebNav, quoteHref } from "@/lib/engine-bay";

type Item = { label: string; href: string };

// Same behavior as the OpPeriod mobile menu: the main links, then the
// equipment areas and brands, which the header passes in.
export function EbMobileMenu({ areas, brands }: { areas: Item[]; brands: Item[] }) {
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

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-lg border border-line-2 hover:bg-card"
      >
        <span className="sr-only">Menu</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav
        id={panelId}
        aria-label="Engine Bay"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 max-h-[calc(100svh-7rem)] overflow-y-auto border-b border-line bg-bg shadow-lg"
      >
        <div className="container-site space-y-6 py-5">
          <ul className="divide-y divide-line">
            {[...ebNav, { label: "Request a Quote", href: quoteHref() }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 font-display text-xl font-bold uppercase tracking-wide">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {[
            { title: "Equipment", items: areas },
            { title: "Brands", items: brands },
          ].map((group) => (
            <div key={group.title}>
              <p className="eyebrow">{group.title}</p>
              <ul className="mt-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setOpen(false)} className="block py-2 font-semibold hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
