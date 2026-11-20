import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import {
  AreasSection,
  BrandCards,
  BrandStrip,
  EbHero,
  SectionHeading,
  StatsStrip,
} from "@/components/engine-bay/home-sections";
import { Logo } from "@/components/logo";
import { ProjectCard } from "@/components/project-card";
import { company, engineBay, logos, siteUrl } from "@/lib/brand";
import { getListedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  description: `${company.description} Home of ${engineBay.name}, loose equipment for fire departments.`,
  alternates: { canonical: "/" },
};

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(projects)).replace(/</g, "\\u003c") }}
      />

      <div className="eb-theme">
        <EbHero srPrefix={`${engineBay.name}:`} />
        <StatsStrip />
        <BrandStrip />
        <AreasSection />
        <section aria-labelledby="brands-we-carry" className="border-t border-line bg-surface/70 py-16 md:py-24">
          <div className="container-site">
            <SectionHeading id="brands-we-carry" eyebrow={engineBay.name} title="Brands we carry" />
            <div className="mt-12">
              <BrandCards />
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="also-from" className="border-t border-line py-16 md:py-24">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">{company.legalName}</p>
              <h2 id="also-from" className="sr-only">
                Also from {company.name}
              </h2>
              <Logo logo={logos.opperiod} className="mt-5 h-12 md:h-14" sizes="(min-width: 768px) 260px, 220px" />
              <p className="mt-5 text-xl leading-relaxed text-muted">
                {company.description} {engineBay.name} is one of our divisions. Here&apos;s what else we run.
              </p>
            </div>
            <Link href="/projects" className={buttonClass("secondary")}>
              See all projects
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-we-operate" className="border-t border-line bg-surface/70 py-16 md:py-24">
        <div className="container-site">
          <SectionHeading
            id="how-we-operate"
            eyebrow={company.name}
            title="How we operate"
            lede="The fire service teaches a few things that work just as well in business."
          />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((value, index) => (
              <li key={value.title} className="card relative overflow-hidden p-7">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-accent-fill to-accent-fill-hover" />
                <span className="font-display text-5xl font-bold leading-none text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-2xl font-bold uppercase">{value.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-muted">{value.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-band text-band-fg">
        <div aria-hidden="true" className="grid-dark absolute inset-0 -z-10" />
        <div className="container-site flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold uppercase leading-[0.95]">Have a project or a question?</h2>
            <p className="mt-4 text-lg text-band-muted">
              Send a message, or email{" "}
              <a href={`mailto:${company.email}`} className="font-semibold text-band-fg underline underline-offset-4">
                {company.email}
              </a>
              .
            </p>
          </div>
          <Link href="/contact" className={buttonClass("primary", "shrink-0")}>
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
