"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

// A header dropdown. A disclosure button, not a hover menu, so it works the
// same with a mouse, a keyboard, or a screen reader. The panel's contents
// come from the server, so links and counts render without client code.
export function NavMenu({
  label,
  active = false,
  activePrefix,
  align = "left",
  panelClassName = "min-w-60",
  children,
}: {
  label: string;
  active?: boolean;
  // Highlight the button on any page under this path.
  activePrefix?: string;
  align?: "left" | "center";
  panelClassName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const current = active || (activePrefix ? pathname.startsWith(activePrefix) : false);

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

  return (
    <div
      ref={wrapper}
      className={align === "center" ? "" : "relative"}
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
      onClick={(event) => {
        // A click on a link inside the panel closes it, even on the same page.
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`nav-link inline-flex items-center gap-1 ${current ? "nav-link-active" : ""}`}
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor">
          <path d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06z" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={`card absolute top-full z-50 mt-3 p-2 ${align === "center" ? "inset-x-0 mx-auto w-[min(100%-2.5rem,68rem)]" : "left-0"} ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
