import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button";
import { Todo } from "@/components/todo";
import { company, owner } from "@/lib/brand";
import { readPublicImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${company.legalName} exists and who runs it.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const photo = owner.photo ? readPublicImage(owner.photo) : undefined;

  return (
    <>
      <section className="container-site py-14 md:py-20">
        <span className="slant-bar" aria-hidden="true" />
        <h1 className="mt-3 font-display text-5xl font-bold uppercase italic md:text-6xl">About</h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_20rem] md:gap-16">
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
            {/* Draft, flagged in CONTENT-TODO.md. */}
            <p>
              {company.legalName} is a small {company.formedIn} company run out of {company.city},{" "}
              {company.state}. It&apos;s the home for a handful of businesses and products, each with its
              own job to do.
            </p>
            <p>
              It&apos;s run by {owner.name}, who also serves as a {owner.role.toLowerCase()}. The fire
              service teaches you to show up, do the job right, and take care of the people around you.
              Opperiod is an attempt to run businesses the same way.
            </p>
            <Todo>
              The story of why Opperiod exists: what got it started, where the name comes from, and what
              you want people to know about how it&apos;s run.
            </Todo>
          </div>

          <figure>
            {photo ? (
              <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={owner.name}
                sizes="(min-width: 768px) 20rem, 100vw"
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-surface p-6 text-center">
                <Todo>A photo of {owner.name}. Portrait orientation works best.</Todo>
              </div>
            )}
            <figcaption className="mt-3">
              <span className="block font-display text-xl font-bold uppercase italic">{owner.name}</span>
              <span className="text-muted">Owner, {company.legalName}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-band py-12 text-band-fg md:py-16">
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase italic md:text-4xl">See what we run</h2>
            <p className="mt-2 text-band-muted">Every project under the {company.name} name.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/projects">View projects</ButtonLink>
            <ButtonLink href="/contact" variant="onDark">
              Contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
