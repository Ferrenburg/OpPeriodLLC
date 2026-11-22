"use client";

import Link from "next/link";
import { useClientPathname } from "./use-client-pathname";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = useClientPathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`nav-link ${active ? "nav-link-active" : ""}`}
    >
      {children}
    </Link>
  );
}
