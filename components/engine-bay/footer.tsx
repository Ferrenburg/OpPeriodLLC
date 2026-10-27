import Link from "next/link";
import { Logo } from "@/components/logo";
import { company, engineBay } from "@/lib/brand";
import { ebNav, quoteHref, toolCategories } from "@/lib/engine-bay";

const yearScript = `document.getElementById("eb-copyright-year").textContent=new Date().getFullYear()`;

export function EbFooter() {
  return (
    <footer className="mt-auto bg-eb-ink text-white">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href={engineBay.path} className="inline-block">
            <Logo logo={engineBay.logo} onDark className="h-12" sizes="80px" />
          </Link>
          <p className="mt-4 text-white/70">
            {engineBay.name} is a division of{" "}
            <Link href="/" className="text-white underline underline-offset-4">
              {company.legalName}
            </Link>
            .
          </p>
          <a href={`mailto:${engineBay.email}`} className="mt-4 inline-block font-semibold text-white underline underline-offset-4">
            {engineBay.email}
          </a>
        </div>

        <nav aria-label="Tools">
          <p className="font-display text-lg font-semibold uppercase italic tracking-wide">Tools</p>
          <ul className="mt-4 space-y-2">
            {toolCategories.map((category) => (
              <li key={category.slug}>
                <Link href={`${engineBay.path}/tools#${category.slug}`} className="text-white/70 hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Engine Bay footer">
          <p className="font-display text-lg font-semibold uppercase italic tracking-wide">Engine Bay</p>
          <ul className="mt-4 space-y-2">
            {[...ebNav, { label: "Request a Quote", href: quoteHref() }, { label: "Privacy", href: "/privacy" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-1 py-6 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>
            &copy; <span id="eb-copyright-year" suppressHydrationWarning>{new Date().getFullYear()}</span> {company.legalName}. All
            rights reserved.
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
