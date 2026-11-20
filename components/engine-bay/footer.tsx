import Link from "next/link";
import { buttonClass } from "@/components/button";
import { Logo } from "@/components/logo";
import { company, engineBay } from "@/lib/brand";
import { equipmentAreas, equipmentPath, quoteHref } from "@/lib/engine-bay";
import { brandPath, getBrands } from "@/lib/engine-bay-catalog";

const yearScript = `document.getElementById("eb-copyright-year").textContent=new Date().getFullYear()`;

const heading = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted";
const link = "text-fg/80 hover:text-accent";

export function EbFooter() {
  const columns = [
    {
      title: "Equipment",
      links: [...equipmentAreas.map((area) => ({ label: area.name, href: `${equipmentPath}#${area.slug}` })), { label: "All equipment", href: equipmentPath }],
    },
    { title: "Brands", links: getBrands().map((brand) => ({ label: brand.name, href: brandPath(brand) })) },
    {
      title: "Company",
      links: [
        { label: "Catalogs", href: `${engineBay.path}/catalogs` },
        { label: "How to order", href: `${engineBay.path}#ordering` },
        { label: "Request a quote", href: quoteHref() },
        { label: company.legalName, href: "/" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <Link href={engineBay.path} className="inline-flex items-center gap-3">
            <Logo logo={engineBay.logo} className="h-10" sizes="80px" />
            <span className="leading-none">
              <span className="block font-display text-2xl font-bold uppercase tracking-wide">Engine Bay</span>
              <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-muted">Supply Co.</span>
            </span>
          </Link>
          <p className="mt-5 text-muted">Loose equipment for fire departments. A division of {company.legalName}.</p>
          <p className="mt-5 flex flex-col gap-1 font-semibold">
            <a href={engineBay.phone.href} className="self-start hover:text-accent">
              {engineBay.phone.display}
            </a>
            <a href={`mailto:${engineBay.email}`} className="self-start hover:text-accent">
              {engineBay.email}
            </a>
          </p>
          <Link href={quoteHref()} className={buttonClass("primary", "mt-6")}>
            Request a quote
          </Link>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={`Footer: ${column.title}`}>
            <p className={heading}>{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
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
