import Link from "next/link";
import { company, footerNav, logos } from "@/lib/brand";
import { getNavProjects } from "@/lib/projects";
import { Logo } from "./logo";

// The year is set at build time, then corrected in the browser so the
// footer stays current even if the site goes a while without a deploy.
const yearScript = `document.getElementById("copyright-year").textContent=new Date().getFullYear()`;

const heading = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted";

export function Footer() {
  const columns = [
    { title: "Site", links: footerNav.map((item) => ({ label: item.label, href: item.href })) },
    { title: "Projects", links: getNavProjects().map((p) => ({ label: p.name, href: p.href })) },
  ];
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-block">
            <Logo logo={logos.opperiod} className="h-8" sizes="140px" />
          </Link>
          <p className="mt-5 text-muted">{company.description}</p>
          <a href={`mailto:${company.email}`} className="mt-4 inline-block font-semibold hover:text-accent">
            {company.email}
          </a>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={`Footer: ${column.title}`}>
            <p className={heading}>{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-fg/80 hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-1 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            &copy; <span id="copyright-year" suppressHydrationWarning>{new Date().getFullYear()}</span> {company.legalName}. All rights
            reserved.
          </p>
          <p>
            {company.legalName} is a {company.formedIn} limited liability company.
          </p>
          <script dangerouslySetInnerHTML={{ __html: yearScript }} />
        </div>
      </div>
    </footer>
  );
}
