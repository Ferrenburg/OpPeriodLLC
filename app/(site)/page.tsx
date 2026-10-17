import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { Logo } from "@/components/logo";
import { ProjectCard } from "@/components/project-card";
import { company, logos } from "@/lib/brand";
import { getListedProjects } from "@/lib/projects";

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

export default function HomePage() {
  const projects = getListedProjects();

  return (
    <>
      <section className="container-site py-14 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">
          {company.city}, {company.state}
        </p>
        <h1 className="mt-4">
          <Logo
            logo={logos.opperiod}
            className="h-14 sm:h-20 md:h-24"
            sizes="(min-width: 768px) 400px, 330px"
            priority
          />
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl">{company.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projects">View projects</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="what-we-run" className="bg-surface py-14 md:py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="slant-bar" aria-hidden="true" />
              <h2 id="what-we-run" className="mt-3 font-display text-4xl font-bold uppercase italic md:text-5xl">
                What we run
              </h2>
            </div>
            <Link href="/projects" className="font-semibold text-accent underline underline-offset-4">
              See all projects
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-we-operate" className="container-site py-14 md:py-20">
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
