import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { SectionHeading } from "@/components/engine-bay/home-sections";
import { Logo } from "@/components/logo";
import { ProjectCard } from "@/components/project-card";
import { company, engineBay, engineBayLink, logos, siteUrl } from "@/lib/brand";
import { toolCategories } from "@/lib/engine-bay";
import { getBrands, getProducts } from "@/lib/engine-bay-catalog";
import { getListedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  description: `${company.description} Parent company of ${engineBay.name}, loose equipment for fire departments.`,
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

// OpPeriod LLC's own page. Engine Bay, the lead business, gets a band that
// sends people to its own site, enginebaysupply.com.
export default function HomePage() {
  const projects = getListedProjects();
  const others = projects.filter((project) => project.slug !== "engine-bay");
  const ebStats = [
    { value: getProducts().length, label: "Items listed" },
    { value: getBrands().length, label: "Brands carried" },
    { value: toolCategories.length, label: "Equipment categories" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(projects)).replace(/</g, "\\u003c") }}
      />

      <section className="border-b border-line bg-surface/60">
        <div className="container-site py-16 md:py-24">
          <p className="eyebrow">{company.legalName}</p>
          <h1 className="mt-6">
            <Logo logo={logos.opperiod} className="h-14 sm:h-20 md:h-24" sizes="(min-width: 768px) 400px, 330px" priority />
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl">{company.description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/projects" className={buttonClass("primary")}>
              View projects
            </Link>
            <Link href="/contact" className={buttonClass("secondary")}>
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="engine-bay" className="eb-theme relative isolate overflow-hidden bg-eb-ink text-white">
        <div aria-hidden="true" className="diamond-plate absolute inset-0 -z-20" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(800px_560px_at_85%_20%,rgb(226_36_27/0.32),transparent_62%)]"
        />
        <div className="container-site grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow text-white/85 before:bg-white/70">Our lead business</p>
            <h2 id="engine-bay" className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-bold uppercase leading-[0.92]">
              {engineBay.name}
            </h2>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-white/90">{engineBay.description}</p>
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-6">
              {ebStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/70">{stat.label}</dt>
                  <dd className="order-first font-display text-4xl font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={engineBayLink("/")} className={buttonClass("primary")}>
                Visit {engineBay.domain}
              </a>
              <a href={engineBayLink("/equipment")} className={buttonClass("onDark")}>
                Shop equipment
              </a>
            </div>
          </div>
          <div aria-hidden="true" className="hidden justify-center lg:flex">
            <Logo logo={engineBay.logo} onDark className="h-56 drop-shadow-2xl xl:h-64" sizes="(min-width: 1280px) 420px, 360px" />
          </div>
        </div>
      </section>

      <section aria-labelledby="what-we-run" className="py-16 md:py-24">
        <div className="container-site">
          <SectionHeading
            id="what-we-run"
            eyebrow={company.name}
            title="What else we run"
            action={
              <Link href="/projects" className={buttonClass("secondary")}>
                See all projects
              </Link>
            }
          />
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
