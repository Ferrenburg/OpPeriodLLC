import Link from "next/link";
import { company, footerNav, logos } from "@/lib/brand";
import { Logo } from "./logo";

// The year is set at build time, then corrected in the browser so the
// footer stays current even if the site goes a while without a deploy.
const yearScript = `document.getElementById("copyright-year").textContent=new Date().getFullYear()`;

export function Footer() {
  return (
    <footer className="mt-auto bg-surface">
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1fr_auto] md:py-16">
        <div className="max-w-sm">
          <Link href="/" className="inline-block">
            <Logo logo={logos.opperiod} className="h-8" sizes="140px" />
          </Link>
          <p className="mt-4 text-muted">{company.description}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-8">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-medium hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-site flex flex-col gap-1 pb-10 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          &copy; <span id="copyright-year" suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
          {company.legalName}. All rights reserved.
        </p>
        <p>{company.state}</p>
        <script dangerouslySetInnerHTML={{ __html: yearScript }} />
      </div>
    </footer>
  );
}
