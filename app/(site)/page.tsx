import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CategoryCard } from "@/components/engine-bay/category-card";
import { Logo } from "@/components/logo";
import { ProjectCard } from "@/components/project-card";
import { company, engineBay, logos, siteUrl } from "@/lib/brand";
import { catalogPath, printCatalogs, quoteHref, toolCategories } from "@/lib/engine-bay";
import { brandPath, getBrandProducts, getBrands, getProducts } from "@/lib/engine-bay-catalog";
import { getListedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  description: `${company.description} Home of ${engineBay.name}, fire service hand tools for departments.`,
  alternates: { canonical: "/" },
};

// How many Engine Bay categories the landing page shows before "All tools".
const FEATURED_CATEGORIES = 6;

// Draft copy, flagged in CONTENT-TODO.md for the owner to rewrite or approve.
const values = [
  {
    title: "Show up",
    text: "If we say we'll be there, we're there. Calls get returned and dates get kept.",
  },
  {
    title: "Do the job right",
    text: "Done right the first time beats done fast and done twice. If something's wrong, we own it and fix it.",
  },
  {
    title: "Take care of people",
    text: "Customers, crews, and neighbors. Treat everyone the way you'd want your own family treated.",
  },
  {
    title: "Keep it straight",
    text: "Plain answers and no runaround. If we can't help, we'll tell you that too.",
  },
];

// Tells search engines who the company is. Facts come from lib/brand.ts.
function organizationJsonLd(projects: ReturnType<typeof getListedProjects>) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.legalName,
    url: base.toString(),
    logo: new URL(logos.opperiod.src, base).toString(),
    email: company.email,
    description: company.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    },
    brand: projects.map((project) => ({
      "@type": "Brand",
      name: project.name,
      url: new URL(project.href, base).toString(),
    })),
  };
}

// Engine Bay leads the landing page; the rest of OpPeriod follows. The
// Engine Bay sections use its colors through .eb-theme.
export default function HomePage() {
  const projects = getListedProjects();
  const others = projects.filter((project) => project.sitePath !== engineBay.path);
  const brands = getBrands();
  const brandNames = brands.map((b) => b.name);
  const toolCount = getProducts().length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(projects)).replace(/</g, "\\u003c") }}
      />

      <div className="eb-theme">
        <section className="diamond-plate relative overflow-hidden text-white">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 -skew-x-12 translate-x-24 bg-eb-red/90 lg:block" aria-hidden="true" />
          <div className="container-site relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-semibold uppercase tracking-[0.3em] text-white/70">
                {engineBay.name} <span className="text-white/50">|</span> {company.name}
              </p>
              <h1 className="mt-4 font-display text-6xl font-bold uppercase italic leading-[0.9] sm:text-7xl md:text-8xl">
                <span className="sr-only">{engineBay.name}: </span>
                Halligans
                <br />
                to hooks.
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/85">
                Fire service hand tools and hose for departments, from {brandNames.slice(0, -1).join(", ")} and {brandNames.at(-1)}.
                Send us your list and we&apos;ll quote it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`${engineBay.path}/tools`}
                  className="inline-flex min-h-12 items-center justify-center rounded-sm bg-eb-red px-7 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-eb-red-dark"
                >
                  Shop {toolCount} tools
                </Link>
                <Link
                  href={quoteHref()}
                  className="inline-flex min-h-12 items-center justify-center rounded-sm border-2 border-white px-7 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-white hover:text-eb-ink"
                >
                  Request a Quote
                </Link>
              </div>
              <p className="mt-6 text-white/85">
                Call{" "}
                <a href={engineBay.phone.href} className="font-semibold text-white underline underline-offset-4">
                  {engineBay.phone.display}
                </a>{" "}
                or{" "}
                <Link href={`${engineBay.path}/catalogs`} className="font-semibold text-white underline underline-offset-4">
                  see the 2026 catalogs
                </Link>
                .
              </p>
            </div>
            <div className="hidden justify-center lg:flex">
              <Link href={engineBay.path} aria-label={`${engineBay.name} home`}>
                <Logo logo={engineBay.logo} onDark className="h-56 drop-shadow-2xl xl:h-64" sizes="420px" priority />
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="shop-by-category" className="py-14 md:py-20">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="shop-by-category" className="font-display text-4xl font-bold uppercase italic leading-none md:text-5xl">
                Shop by category
              </h2>
              <Link href={`${engineBay.path}/tools`} className="font-semibold text-accent underline underline-offset-4">
                All {toolCategories.length} categories
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {toolCategories.slice(0, FEATURED_CATEGORIES).map((category) => (
                <li key={category.slug}>
                  <CategoryCard category={category} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="brands-catalogs" className="bg-eb-paper py-14 md:py-20">
          <div className="container-site">
            <h2 id="brands-catalogs" className="font-display text-4xl font-bold uppercase italic leading-none md:text-5xl">
              Brands we carry
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => {
                const catalog = printCatalogs.find((c) => c.brandSlug === brand.slug);
                return (
                  <li key={brand.slug} className="flex flex-col border-2 border-line bg-bg p-6">
                    <h3 className="font-display text-3xl font-bold uppercase italic leading-none">
                      <Link href={brandPath(brand)} className="hover:text-accent">
                        {brand.name}
                      </Link>
                    </h3>
                    {brand.about[0] && <p className="mt-2 flex-1 text-muted">{brand.about[0]}</p>}
                    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-semibold">
                      <Link href={brandPath(brand)} className="text-accent underline underline-offset-4">
                        {getBrandProducts(brand.slug).length} tools and parts
                      </Link>
                      {catalog && (
                        <Link href={catalogPath(catalog)} className="text-accent underline underline-offset-4">
                          2026 catalog
                        </Link>
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <section aria-labelledby="also-from" className="py-14 md:py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 id="also-from" className="sr-only">
                Also from {company.name}
              </h2>
              <Logo logo={logos.opperiod} className="h-12 md:h-14" sizes="(min-width: 768px) 260px, 220px" />
              <p className="mt-5 text-xl leading-relaxed">
                {company.description} {engineBay.name} is one of our divisions. Here&apos;s what else we run.
              </p>
            </div>
            <Link href="/projects" className="font-semibold text-accent underline underline-offset-4">
              See all projects
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-we-operate" className="bg-surface py-14 md:py-20">
        <div className="container-site">
          <span className="slant-bar" aria-hidden="true" />
          <h2 id="how-we-operate" className="mt-3 font-display text-4xl font-bold uppercase italic md:text-5xl">
            How we operate
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            The fire service teaches a few things that work just as well in business.
          </p>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {values.map((value, index) => (
              <li key={value.title} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="w-16 shrink-0 font-display text-5xl font-bold italic leading-none text-accent"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase italic">{value.title}</h3>
                  <p className="mt-1 text-lg text-muted">{value.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-band text-band-fg">
        <div className="container-site flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase italic md:text-4xl">
              Have a project or a question?
            </h2>
            <p className="mt-2 text-band-muted">
              Send a message, or email{" "}
              <a href={`mailto:${company.email}`} className="font-semibold text-band-fg underline underline-offset-4">
                {company.email}
              </a>
              .
            </p>
          </div>
          <ButtonLink href="/contact" className="shrink-0">
            Get in touch
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
